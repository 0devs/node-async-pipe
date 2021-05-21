import {
  createPipe, pipe, catchAll, catchInstanceOf, catchCode, catchInstanceOfAndCode,
} from './Pipe';

class TestError {
  public code?: string;
}

describe('Pipe', () => {
  describe('createPipe', () => {
    it('should create and resolve async pipe', () => {
      const p = createPipe(
        async (s) => s + 1,
        async (s) => s + 1,
        async (s) => s + 1,
      );

      return p(0).then((s) => {
        expect(s).toEqual(3);
      });
    });

    it('should create and reject async pipe', () => {
      const p = createPipe(
        async (s) => s + 1,
        async (s) => s + 1,
        async () => {
          throw new Error('reject');
        },
      );

      return p(0)
        .then(() => {
          throw new Error('should reject pipe');
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('reject');
        });
    });

    it('should throw error if no element passed', () => {
      expect.assertions(2);
      try {
        createPipe();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('pipe requires at least one argument');
      }
    });

    it('should throw error if pipe element is not a function', () => {
      expect.assertions(2);

      try {
        // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createPipe(async () => 1, 100500);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual(
          'pipe requires each argument to be a function. Argument #2 is of type "number"',
        );
      }
    });
  });

  describe('pipe', () => {
    it('should create and run pipe immediately', () => pipe(
      async () => 0,
      async (s) => s + 1,
      async (s) => s + 1,
      async (s) => s + 1,
    )
      .then((s) => {
        expect(s).toEqual(3);
      }));
  });

  describe('catchAll', () => {
    it('should catch all pipe error', () => {
      expect.assertions(2);

      return pipe(
        async () => 0,
        async () => {
          throw new Error('reject');
        },
        catchAll((error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('reject');
        }),
      );
    });
  });

  describe('catchInstanceOf', () => {
    it('should catch error instance of expected', () => {
      expect.assertions(1);

      return pipe(
        async () => 0,
        async () => {
          throw new TestError();
        },
        catchInstanceOf(TestError, (error) => {
          expect(error).toBeInstanceOf(TestError);
        }),
      );
    });

    it('should throw error, if error not instance of expected', () => {
      expect.assertions(2);

      return pipe(
        async () => 0,
        async () => {
          throw new Error('reject');
        },
        catchInstanceOf(TestError, () => 0),
      )
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('reject');
        });
    });
  });

  describe('catchCode', () => {
    it('should catch error with expected code', () => {
      expect.assertions(2);

      return pipe(
        async () => 0,
        async () => {
          const error = new TestError();
          error.code = 'TEST_CODE';
          throw error;
        },
        catchCode('TEST_CODE', (error) => {
          expect(error).toBeInstanceOf(TestError);
          expect(error.code).toEqual('TEST_CODE');
        }),
      );
    });

    it('should throw error, if error has no expected code', () => {
      expect.assertions(2);

      return pipe(
        async () => 0,
        async () => {
          throw new Error('reject');
        },
        catchCode('TEST_CODE', () => 0),
      )
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('reject');
        });
    });
  });

  describe('catchInstanceOfAndCode', () => {
    it('should catch error with expected instance and code', () => {
      expect.assertions(2);

      return pipe(
        async () => 0,
        // eslint-disable-next-line sonarjs/no-identical-functions
        async () => {
          const error = new TestError();
          error.code = 'TEST_CODE';
          throw error;
        },
        catchInstanceOfAndCode(TestError, 'TEST_CODE', (error) => {
          expect(error).toBeInstanceOf(TestError);
          expect(error.code).toEqual('TEST_CODE');
        }),
      );
    });

    it('should throw error, if error not expected instance and code', () => {
      expect.assertions(1);

      return pipe(
        async () => 0,
        async () => {
          throw new TestError();
        },
        catchInstanceOfAndCode(TestError, 'TEST_CODE', () => 0),
      )
        .catch((error) => {
          expect(error).toBeInstanceOf(TestError);
        });
    });
  });
});
