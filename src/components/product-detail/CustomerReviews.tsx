import React from 'react';
import { ProductReviews } from './reviews/ProductReviews';
import { Product } from '../../types';

interface CustomerReviewsProps {
  product: Product;
}

export default function CustomerReviews({ product }: CustomerReviewsProps) {
  return (
    <ProductReviews 
      productId={product.sku}
      productName={product.name}
    />
  );
}
