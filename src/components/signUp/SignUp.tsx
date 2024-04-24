'use client';
import React, { useState } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      className=" card border-gray-300 border-2"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const a = await createUserWithEmailAndPassword(auth, user.email, user.password);
          console.log(a);
          alert('회원가입 성공~');
          router.push('/');
        } catch (e) {
          console.error(e);
        }
      }}>
      <div className="card-body">
        <h3 className=" card-title text-2xl mb-5">회원가입</h3>
        <div>
          <div className="flex justify-between">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">닉네임</span>
              </div>
              <input
                name="email"
                type="email"
                className="input input-bordered w-full"
                required
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="flex justify-between">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">패스워드</span>
              </div>
              <input
                name="password"
                type="password"
                className="input input-bordered w-full"
                required
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <div className="card-actions items-center mt-5">
          <button
            type="submit"
            className="btn btn-active btn-neutral rounded-3xl text-xl">
            회원가입
          </button>
          <div className="">
            <span>이미 계정이 있으신가요?</span>
            <Link
              className=" text-decoration : underline"
              href={'/signIn'}>
              로그인
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
