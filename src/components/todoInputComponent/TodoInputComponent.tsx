import React, { FC } from 'react';
import { useFormik } from 'formik';
import Input from '../input/Input';
import styles from '../authorization/authorization.module.scss';
import { useAppDispatch } from '../../lib/hooks';
import { closeTodoForm } from '../../lib/slice';

interface TodoInputProps {
  fields: Array<{formName: string, placeholder: string, select?: boolean}>;
  validation?: any;
  isVisible: boolean;
  onFormSubmit: (values: any) => void;
  inputText: string;
}

const TodoInputComponent: FC<TodoInputProps> = ({fields, validation, isVisible, onFormSubmit, inputText}) => {
  const initialValues = fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.formName] = '';
    return acc;
  }, {});
  
  const dispatch = useAppDispatch();
  
  const formik = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: onFormSubmit,
  });
  
  return (
    <div className={isVisible ? 'flex flex-col items-center justify-center mt-10 pb-10' : 'hidden'}>
      <h2 className={`${styles.authorization__title} mb-10`}>{inputText}</h2>
      <form onSubmit={formik.handleSubmit}>
        {fields.map((field) => (
          <div key={field.formName} style={{marginBottom: '10px'}}>
            {
              !field.select &&
              <Input
                name={field.formName}
                type={'text'}
                placeholder={field.placeholder}
                value={formik.values[field.formName]}
                onChangeFn={formik.handleChange}
                onBlurFn={formik.handleBlur}
                isTouched={formik.touched[field.formName]}
                error={formik.errors[field.formName]}
              />
            }
            {
              field.select &&
              <div className={'flex flex-col items-center justify-center'}>
                <label className={'mb-5'} htmlFor={field.placeholder}>{field.placeholder}</label>
                <select
                  name={field.formName}
                  onChange={formik.handleChange}
                  className={styles.form__field}
                >
                  <option className={'text-black'} value=''></option>
                  <option className={'text-black'} value='to do'>to do</option>
                  <option className={'text-black'} value='in progress'> in progress</option>
                  <option className={'text-black'} value='done'>done</option>
                </select>
              </div>
            }
          </div>
        ))}
        <div className={'flex items-center justify-space-between'}>
          <button className={styles.form__cancel} type='reset' onClick={() => dispatch(closeTodoForm())}>
            Cancel
          </button>
          <button className={styles.form__submit} type='submit'>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default TodoInputComponent;