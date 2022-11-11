/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51M2h9CFRKAndTJ0T3GSlaj0VV7tPXmWH9d7WcFjeXay514ADzY2aDzRyJx2F6wVJ6xT0r3LBygJ4QXpKWRKqmjA000QPw0FHc8'
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

  } catch (err) {
    showAlert('error', err);
  }
};
