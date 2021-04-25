module.exports = {
  users: {
    getById: jest.fn(() =>
      Promise.resolve({
        id: 'foo',
      }),
    ),
    verify: jest.fn(
      name =>
        new Promise((resolve, reject) => {
          if (name === 'foo') {
            resolve({
              _id: 1,
              name: 'foo',
            });
          } else if (name === 'error') {
            reject(new Error());
          } else {
            resolve(null);
          }
        }),
    ),
    create: jest.fn(
      name =>
        new Promise((resolve, reject) => {
          if (name === 'foo') {
            resolve();
          } else {
            reject();
          }
        }),
    ),
  },
};
