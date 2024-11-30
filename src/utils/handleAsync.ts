import { notification } from "../configs/notification.config";

type AsyncFunction<T, A extends any[]> = (...args: A) => Promise<T>;

const handleAsync = <T, A extends any[]>(
  asyncFn: AsyncFunction<T, A>,
  onFinally?: () => void,
  onError?: (error: Error) => void
): AsyncFunction<T | null, A> => {
  return async (...args: A): Promise<T | null> => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        notification.error(error.message);
        if (onError) {
          onError(error);
        }
      }
      return null;
    } finally {
      if (onFinally) {
        onFinally();
      }
    }
  };
};

export default handleAsync;
