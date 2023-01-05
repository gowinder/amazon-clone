import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductDocument } from './product.schema';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAllProducts(): Promise<ProductDocument[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string): Promise<ProductDocument> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  UpdateProduct(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description?: string,
  ): Promise<ProductDocument> {
    return this.productService.update(id, name, price, description);
  }

  @Post()
  createProduct(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description?: string,
  ): Promise<ProductDocument> {
    return this.productService.create(name, price, description);
  }
}
