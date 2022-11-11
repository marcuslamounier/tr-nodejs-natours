/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const baseUrl = '/api/v1/users';
    const res = await axios({
      method: 'PATCH',
      url: `${baseUrl}${
        type === 'password' ? '/updateMyPassword' : '/me'
      }`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type.toUpperCase()} updated successfully.`
      );
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
