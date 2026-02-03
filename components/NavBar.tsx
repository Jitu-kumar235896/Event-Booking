"use client"

import Link from "next/link"
import Image from "next/image"
import posthog from "posthog-js"

const NavBar = () => {
  const handleNavClick = (linkName: string) => {
    posthog.capture("nav_link_clicked", {
      link_name: linkName,
      nav_location: "header",
    })
  }

  return (
    <header>
      <nav>
        <Link href='/' className="logo" onClick={() => handleNavClick("logo")}>
          <Image src="/icons/logo.png" alt="logo-img" width={24} height={24} />
        </Link>

        <ul>
          <Link href='/' onClick={() => handleNavClick("Home")}>Home</Link>
          <Link href='/' onClick={() => handleNavClick("Events")}>Events</Link>
          <Link href='/' onClick={() => handleNavClick("Create Events")}>Create Events</Link>
        </ul>
      </nav>
    </header>
  )
}

export default NavBar
