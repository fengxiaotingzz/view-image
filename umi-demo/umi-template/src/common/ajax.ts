import {message} from 'antd'

const handleResult = (res) => {
    message.error(res?.msg)
}

export const getData = ({ url }) => {
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res?.status === 0) {
        return res;
      }

      handleResult(res)
    });
};

export const request = ({ url, method = 'get' }) => {
  if (method === 'get') {
    return getData({ url });
  }
};
