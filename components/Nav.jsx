"use client";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import "../flow/config.js";
import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  const [user, setUser] = useState({ loggedIn: false });

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  function handleAuthentication() {
    if (user.loggedIn) {
      fcl.unauthenticate();
    } else {
      fcl.authenticate();
    }
  }

  return (
    <nav className="border-gray-200 bg-white px-2 py-2.5 dark:bg-gray-800 sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <a href="/" className="flex items-center">
          <Image
            src="/logo.png"
            className="mr-3"
            alt="Logo"
            width={100}
            height={150}
          />
          <span className="mx-5 self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Moja Kwa Moja
          </span>
        </a>
        <div className="flex md:order-2">
          <ul className="mt-4 mx-2 flex flex-col items-center justify-between md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium">
            <li>
              <Link
                href="/charities"
                className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
              >
                Charities
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
              >
                Donate
              </Link>
            </li>
            <li>
              <Link
                href="/redeem"
                className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
              >
                Redeem
              </Link>
            </li>
          </ul>

          <button
            className="mx-2 md:text-sm md:font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
            onClick={handleAuthentication}
          >
            {user.loggedIn ? user.addr : "Log In"}
          </button>
        </div>
      </div>
    </nav>
  );
}
