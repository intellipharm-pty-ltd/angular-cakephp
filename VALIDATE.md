## Validate

To reduce client side validation, we built a ```validation``` method into our CakePHP REST API. In ```AppController.php``` we did something like this.

```php
    <?php
    App::uses('Controller', 'Controller');

    class AppController extends Controller {
        public $components = array('Response', 'Validation');

        /**
         * validation
         */
        public function validation() {
            try {
                $params = $this->controller->request->data;

                // validation
                if (!array_key_exists('data', $params)) {
                    return $this->Response->returnError(null, self::ERROR_INVALID_REQUEST);
                }

                // fields
                $fields = $this->controller->request->data['fields'];
                $fields = $fields === '' ? array() : explode(',', $fields);

                // validate
                $validation_error_message = $this->Validation->validate($this->modelClass, $this->params['data'], $fields);

                if (!empty($validation_error_message)) {
                    return $this->Response->returnError($validation_error_message, 'invalid');
                }

                return $this->Response->returnSuccess(null, 'valid');
            } catch (Exception $e) {
                return $this->Response->returnError(null, $e->getMessage());
            }
        }
    }
    ?>
```

The ```ValidationComponent.php```

```php
    <?php
    App::uses('AppComponent', 'Controller/Component');

    class ValidationComponent extends AppComponent {

        /**
         * validate
         * returns error message or empty string
         *
         * @param $model_class
         * @param $data
         * @param array $validate_fields
         * @param array $additional_validate_rules
         * @param boolean $return_only_first_error
         * @return string
         */
        public function validate($model_class, $data, $validate_fields = array(), $additional_validate_rules = array(), $return_only_first_error = false) {

            $error_message = "";

            // get model
            $model = ClassRegistry::init($model_class);

            // add additional non-model validation
            foreach ($additional_validate_rules as $key => $valdiation) {
                $model->validate[$key] = $valdiation;
            }

            // set model data
            $model->set($data);

            // validate data
            $params = !empty($validate_fields) ? array('fieldList' => $validate_fields) : array();
            $result = $model->validates($params);

            // unset additional non-model validation
            foreach ($additional_validate_rules as $key => $valdiation) {
                unset($model->validate[$key]);
            }

            if (!$result) {
                // return only first message
                if ($return_only_first_error) {
                    return $model->getFirstValidationErrorMessage($model->validationErrors);
                }

                // return all errors
                return $model->validationErrors;
            }

            // no errors
            return array();
        }
    }

    ?>
```


The ```ResponseComponent.php```

```php
    <?php
    App::uses('AppComponent', 'Controller/Component');

    class ResponseComponent extends AppComponent {

        /**
         * returnSuccess
         * Returns the given data as a success to the browser
         *
         * @param data
         * @param message
         * @param extraSerialize
         * @param statusCode
         */
        public function returnSuccess($data = null, $message = 'Success', $extraSerialize = array(), $statusCode = 200) {
            return $this->response(true, $data, $message, $extraSerialize, $statusCode);
        }

        /**
         * returnError
         * Returns the given data as an error to the browser
         *
         * @param exception
         * @param message
         * @param extraSerialize
         * @param statusCode
         */
        public function returnError($data = null, $message = 'Error', $extraSerialize = array(), $statusCode = 400) {
            return $this->response(false, $data, $message, $extraSerialize, $statusCode);
        }

        /**
         * response
         * Sends the response
         *
         * @param status
         * @param data
         * @param message
         * @param extraSerialize
         * @param statusCode
         */
        protected function response($status = true, $data = null, $message = '', $extra_serialize = array(), $status_code = 200) {
            $this->controller->set(array(
                'status' => $status,
                'code' => $status_code,
                'data' => $data,
                'message' => $message,
                '_serialize' => array_merge($extra_serialize, array('status', 'code', 'message', 'data'))
            ));

            $this->controller->response->statusCode($status_code);
            $this->controller->render();

            return $this->controller->response;
        }
    }

    ?>
```
