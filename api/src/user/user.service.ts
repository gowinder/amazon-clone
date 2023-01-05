import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { UserDetails } from './user-detail.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModule: Model<UserDocument>,
  ) {}

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<UserDetails> {
    const newUser = new this.userModule({ name, email, password });
    const user = await newUser.save();
    return this._getUserDetails(user);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModule.findOne({ email: email }).exec();
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModule.findById({ _id: id }).exec();
    if (!user) return null;
    return this._getUserDetails(user);
  }
}
