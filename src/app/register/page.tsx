"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useLanguageStore } from "@/store/useLanguageStore";

const registerContent = {
  ru: {
    title: "Регистрация аккаунта",
    subtitle: "Пожалуйста заполните все формы регистрации",
    firstNamePlaceholder: "Имя",
    lastNamePlaceholder: "Фамилия",
    usernamePlaceholder: "Юзернейм Телеграмм",
    usernameRequired: "Юзернейм обязателен",
    usernameTaken: "Юзернейм занят",
    countryPlaceholder: "Страна",
    emailPlaceholder: "Емейл",
    phonePlaceholder: "Мобильный телефон",
    passwordPlaceholder: "Пароль",
    passwordRequired: "Пароль обязателен",
    password2Placeholder: "Подтвердите пароль",
    password2Required: "Подтверждение пароля обязательно",
    passwordsMismatch: "Пароли не совпадают",
    invitedBy: "Приглашен:",
    submitButton: "Продолжить",
  },
  en: {
    title: "Account Registration",
    subtitle: "Please fill out all registration forms",
    firstNamePlaceholder: "First Name",
    lastNamePlaceholder: "Last Name",
    usernamePlaceholder: "Telegram Username",
    usernameRequired: "Username is required",
    usernameTaken: "Username is taken",
    countryPlaceholder: "Country",
    emailPlaceholder: "Email",
    phonePlaceholder: "Mobile Phone",
    passwordPlaceholder: "Password",
    passwordRequired: "Password is required",
    password2Placeholder: "Confirm Password",
    password2Required: "Password confirmation is required",
    passwordsMismatch: "Passwords do not match",
    invitedBy: "Invited by:",
    submitButton: "Continue",
  },
};

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onChange" });
  const router = useRouter();
  const { language } = useLanguageStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [referrer, setReferrer] = useState<string>("none");
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);

  const checkUsername = async (username: string) => {
    if (!username) return;

    try {
      const response = await fetch("/api/auth/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      setIsUsernameUnique(result.isUnique);
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("referrer");
    if (ref) setReferrer(ref);
  }, []);

  const validatePassword2 = (password2: string): boolean | string => {
    if (password2 !== watch("password")) {
      return registerContent[language].passwordsMismatch;
    }
    return true;
  };

  const onSubmit = async (data) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, referrer }),
    });
    const result = await res.json();
    if (result.success) {
      router.push("/dashboard");
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 w-full max-w-md sm:min-w-[600px]"
      >
        <h2 className="text-3xl mb-6 text-center">{registerContent[language].title}</h2>
        <h3 className="mb-6 text-center">{registerContent[language].subtitle}</h3>
        <div className="flex sm:gap-[15px] flex-col sm:flex-row">
          <input
            {...register("firstName")}
            autoComplete="given-name"
            placeholder={registerContent[language].firstNamePlaceholder}
            required
            className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
          />
          <input
            {...register("lastName")}
            autoComplete="family-name"
            placeholder={registerContent[language].lastNamePlaceholder}
            required
            className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
          />
        </div>
        {errors.firstName && (
          <p className="text-red-500 text-sm">{String(errors.firstName.message)}</p>
        )}
        {errors.lastName && (
          <p className="text-red-500 text-sm">{String(errors.lastName.message)}</p>
        )}
        <div className="flex sm:gap-[15px] flex-col sm:flex-row">
          <input
            {...register("username", {
              required: registerContent[language].usernameRequired,
              validate: async (value) => {
                const trimmedValue = value.trim();
                await checkUsername(trimmedValue);
                return isUsernameUnique || registerContent[language].usernameTaken;
              },
            })}
            autoComplete="off"
            placeholder={registerContent[language].usernamePlaceholder}
            type="text"
            required
            className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
          />
          <input
            {...register("country")}
            placeholder={registerContent[language].countryPlaceholder}
            required
            className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
          />
        </div>
        {errors.username && (
          <p className="text-red-500 text-sm">{String(errors.username.message)}</p>
        )}
        {errors.country && (
          <p className="text-red-500 text-sm">{String(errors.country.message)}</p>
        )}
        <div className="flex sm:gap-[15px] flex-col sm:flex-row">
          <input
            id="email"
            {...register("email")}
            autoComplete="email"
            placeholder={registerContent[language].emailPlaceholder}
            type="email"
            required
            className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
          />
          <input
            {...register("phone")}
            autoComplete="tel"
            type="tel"
            placeholder={registerContent[language].phonePlaceholder}
            required
            className="mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
        )}
        {errors.phone && (
          <p className="text-red-500 text-sm">{String(errors.phone.message)}</p>
        )}
        <div className="flex gap-[15px] flex-col sm:flex-row">
          <div className="relative w-full">
            <input
              {...register("password", {
                required: registerContent[language].passwordRequired,
              })}
              type={showPassword ? "text" : "password"}
              placeholder={registerContent[language].passwordPlaceholder}
              required
              className="w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[8px] right-[8px] flex items-center"
            >
              {showPassword ? (
                <Image
                  src="/register/eye-password-hide.svg"
                  alt="Hide password"
                  width={24}
                  height={24}
                  objectFit="cover"
                  priority={false}
                />
              ) : (
                <Image
                  src="/register/eye.svg"
                  alt="Show password"
                  width={24}
                  height={24}
                  objectFit="cover"
                  priority={false}
                />
              )}
            </button>
          </div>
          <div className="relative w-full">
            <input
              {...register("password2", {
                validate: validatePassword2,
                required: registerContent[language].password2Required,
              })}
              placeholder={registerContent[language].password2Placeholder}
              type={showPassword2 ? "text" : "password"}
              required
              className="max-h-[40px] mb-4 w-full px-3 py-2 border-[#d1d6da] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#e8f0fd]"
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute top-[8px] right-[8px] flex items-center"
            >
              {showPassword2 ? (
                <Image
                  src="/register/eye-password-hide.svg"
                  alt="Hide password"
                  width={24}
                  height={24}
                  objectFit="cover"
                  priority={false}
                />
              ) : (
                <Image
                  src="/register/eye.svg"
                  alt="Show password"
                  width={24}
                  height={24}
                  objectFit="cover"
                  priority={false}
                />
              )}
            </button>
          </div>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
        )}
        {errors.password2 && (
          <p className="text-red-500 text-sm">{String(errors.password2.message)}</p>
        )}
        {referrer && referrer !== "none" && (
          <div className="flex mb-[15px]">
            <div className="text-[#8190b1] text-[13px] mr-[3px]">
              {registerContent[language].invitedBy}
            </div>
            <div className="text-[#8190b1] text-[13px] font-bold">{referrer}</div>
          </div>
        )}
        <button
          type="submit"
          className="mb-[20px] w-full bg-[#234bef] text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
        >
          {registerContent[language].submitButton}
        </button>
      </form>
    </div>
  );
}