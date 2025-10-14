import { unauthorizedErrorResponse } from "./unauthorizedErrorResponse";
import { internalServerErrorResponse } from "./internalServerErrorResponse";
import { invalidRequestErrorResponse } from "./invalidRequestErrorResponse";
import { orderNotFoundResponse } from "./typesenseResponses/orderNotFoundResponse";

export const responses = {
  unauthorized: unauthorizedErrorResponse,
  invalidRequest: invalidRequestErrorResponse,
  internalServerError: internalServerErrorResponse,

  typesense: {
    orderNotFound: orderNotFoundResponse,
  },
};
