// SignUp.tsx
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
	firstName: z.string().min(1, 'First name cannot be blank'),
	lastName: z.string().min(1, 'Last name cannot be blank'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Define the types for the form inputs
type SignUpInputs = z.infer<typeof loginSchema>;

const SignUpForm: React.FC = () => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {

		const response = await fetch(`/api/auth/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body:  JSON.stringify({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password
			})
		})

		const responseData = await response.json()
		console.log(response)
		console.log(responseData)

    if (!response.ok) {
      setErrorMessage(responseData.message);
    } else {
			setErrorMessage(null);

			//sign in user...
			const response = await signIn('credentials', {
				redirect: false,
				email: data.email,
				password: data.password
			})

			if (response?.error) {
				setErrorMessage(response.error);
			} else {
				// Successful login
				window.location.reload();
			}

    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* <h1 className='p-dialog-title'>Log In</h1> */}
			<div className="flex flex-wrap align-items-center mb-3 gap-2">
        <InputText
          placeholder="First name"
          {...register('firstName')}
          className={`p-inputtext-sm ${errors.firstName ? 'p-invalid mr-2' : ''}`}
        />
        {errors.firstName && (
          <Message severity="error" text={errors.firstName.message} />
        )}
      </div>
			<div className="flex flex-wrap align-items-center mb-3 gap-2">
        <InputText
          placeholder="Last name"
          {...register('lastName')}
          className={`p-inputtext-sm ${errors.lastName ? 'p-invalid mr-2' : ''}`}
        />
        {errors.lastName && (
          <Message severity="error" text={errors.lastName.message} />
        )}
      </div>
      <div className="flex flex-wrap align-items-center mb-3 gap-2">
        <InputText
          placeholder="Email"
          {...register('email')}
          className={`p-inputtext-sm ${errors.email ? 'p-invalid mr-2' : ''}`}
        />
        {errors.email && (
          <Message severity="error" text={errors.email.message} />
        )}
      </div>
      <div className="flex flex-wrap align-items-center mb-3 gap-2">
        <InputText
          type="password"
          placeholder="Password"
          {...register('password')}
          className={`p-inputtext-sm ${errors.password ? 'p-invalid mr-2' : ''}`}
        />
        {errors.password && (
          <Message severity="error" text={errors.password.message} />
        )}
      </div>
			{errorMessage && (
        <Message severity="error" text={errorMessage} />
      )}
      <Button label="Sign Up" className="p-card-button" type="submit" />
    </form>
  );
};

export default SignUpForm;
