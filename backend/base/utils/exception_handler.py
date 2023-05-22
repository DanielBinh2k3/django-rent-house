from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    handlers = {
        'ValidationError': _handle_generic_error,
        'Http404': _handle_generic_error,
        'PermissionDenied': _handle_generic_error,
        'Unauthorized': _handle_authentication_error,
        'NotAuthenticated': _handle_authentication_error,
        'AuthenticationFailed': _handle_authentication_error,
    }
    response = exception_handler(exc, context)

    if response is not None:
        if 'AuthUserAPIView' in str(context['view']) and exc.status_code == 401:
            response.status_code = 200
            response.data = {"is_logged_in": False}
            logger.error(response, context)
            return response
        response.data['status_code'] = response.status_code
    else:
        response = Response({'error': 'An error occurred on the server. Please contact us for more information.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        logger.critical(response, exc_info=exc)
    exception_class = exc.__class__.__name__
    if exception_class in handlers:
        return handlers[exception_class](exc, context, response)
    return response


def _handle_authentication_error(exc, context, response):

    response_data = {
        'error': 'Please login to proceed',
        'status_code': response.status_code
    }
    logger.error('log in failed')
    return Response(response_data, status=response.status_code)


def _handle_generic_error(exc, context, response):
    response_data = {
        'error': str(exc),
        'status_code': response.status_code
    }
    logger.error(response_data, context)
    return Response(response_data, status=response.status_code)
