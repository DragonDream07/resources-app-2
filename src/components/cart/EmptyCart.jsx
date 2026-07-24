import React from 'react';
import { Link } from 'react-router-dom';
import emptyStateImg from '@/assets/images/empty-state.svg';

const EmptyCart = () => {
  return (
    <div className="empty-cart">
      <div className="empty-cart__illustration">
        <img
          src={emptyStateImg}
          alt="Empty shopping cart"
          className="empty-cart__image"
        />
      </div>

      <h2 className="empty-cart__heading">Your cart is empty</h2>

      <p className="empty-cart__subtext">
        Looks like you haven&rsquo;t added anything yet. Start shopping to fill it up!
      </p>

      <Link to="/products" className="empty-cart__cta btn btn--primary">
        Browse Products
      </Link>
    </div>
  );
};

export default EmptyCart;
