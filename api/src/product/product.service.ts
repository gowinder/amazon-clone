import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModule } from './product.module';
import { ProductDocument } from './product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModule: Model<ProductDocument>,
  ) {}

  async create(
    name: string,
    price: number,
    description: string,
  ): Promise<ProductDocument> {
    const newProduct = new this.productModule({ name, price, description });
    return newProduct.save();
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productModule.find().exec();
  }

  async findOne(id: string): Promise<ProductDocument> {
    return this.productModule.findById(id).exec();
  }

  async update(id: string, name: string, price: number, description: string) {
    let product = await this.findOne(id);
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;

    return product.save();
  }

  async delete(id: string) {
    return this.productModule.deleteOne({ _id: id }).exec();
  }
}
