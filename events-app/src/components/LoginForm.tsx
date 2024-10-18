// LoginForm.tsx
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { signIn } from 'next-auth/react';

// Define the Zod schema for validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Define the types for the form inputs
type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const response = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    })
    console.log(response)
    if (response?.error) {
      // Handle error (e.g., show message)
      console.error(response.error);
      setErrorMessage(response.error);
    } else {
      // Successful login
      // Optionally, you can reload the page
      setErrorMessage(null);
      window.location.reload(); // Reload the page to fetch new session data
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* <h1 className='p-dialog-title'>Log In</h1> */}
      <div>
        <InputText
          placeholder="Email"
          {...register('email')}
          className={`p-inputtext-sm ${errors.email ? 'p-invalid' : ''}`}
        />
        {errors.email && (
          <Message severity="error" text={errors.email.message} />
        )}
      </div>
      <div>
        <InputText
          type="password"
          placeholder="Password"
          {...register('password')}
          className={`p-inputtext-sm ${errors.password ? 'p-invalid' : ''}`}
        />
        {errors.password && (
          <Message severity="error" text={errors.password.message} />
        )}
      </div>
      {errorMessage && (
        <Message severity="error" text={errorMessage} />
      )}
      <Button label="Log In" className="p-card-button" type="submit" />
    </form>
  );
};

export default LoginForm;
