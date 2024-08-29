import { notification } from "antd";
import { useEffect } from "react";

export function useErrorMessage(error: Error | null) {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (error) {
      api.error({
        duration: 0,
        message: "Something went wrong!",
        description: error.message,
      });
    } else {
      api.destroy();
    }
  }, [api, error]);

  return { contextHolder };
}
