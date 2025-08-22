// src/app/page.tsx
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// --- Simulating a database of existing users
const existingUsers = [
  { email: "test@example.com" },
  { email: "user@domain.com" },
];

// --- Zod Schema
const authSchema = z
  .object({
    email: z.string().email("Invalid email address").trim(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => data.password !== data.email,
    {
      message: "Password cannot be the same as your email",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

type AuthData = z.infer<typeof authSchema>;
type PageState = 'signIn' | 'signUp';

export default function AuthPage() {
  const [pageState, setPageState] = useState<PageState>('signIn');
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    setError, 
    formState: { errors } 
  } = useForm<AuthData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = (data: AuthData) => {
    if (pageState === 'signIn') {
      console.log("Signing In with data:", data);
      alert(`Signing in with email: ${data.email}`);
    } else { // Sign-Up logic
      const isEmailTaken = existingUsers.some(user => user.email === data.email);
      if (isEmailTaken) {
        setError("email", {
          type: "manual",
          message: "This email is already registered",
        });
        return;
      }
      
      // If sign-up is successful
      console.log("Signing Up with data:", data);
      alert(`Signing up with email: ${data.email}`);
      
      // Automatically redirect to the Sign In page
      setPageState('signIn');
      reset(); // Resets the form after a successful sign-up
    }
  };

  const togglePageState = () => {
    setPageState(pageState === 'signIn' ? 'signUp' : 'signIn');
    reset();
  };

  const formTitle = pageState === 'signIn' ? 'Sign In' : 'Sign Up';
  const buttonText = pageState === 'signIn' ? 'Sign In' : 'Sign Up';

  return (
    <main className="flex min-h-screen items-center justify-center p-24 bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-black">{formTitle}</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
            {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
          </div>

          {pageState === 'signUp' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              />
              {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {buttonText}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={togglePageState} 
            className="text-indigo-600 hover:underline text-sm"
          >
            {pageState === 'signIn' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </main>
  );
}