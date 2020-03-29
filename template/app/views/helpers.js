import dateFormat from 'date-fns/format';

// https://date-fns.org/docs/format
export function formatDate(date) {
  return dateFormat(date, 'eee d LLL HH:mm');
}

export function formatPrice(amount, currency) {
  return `${amount.toLocaleString()} ${currency}`;
}

// RNN
export function setTitle(title) {
  return {
    topBar: {
      title: {
        text: title,
      },
    },
  };
}
