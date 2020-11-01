import React from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faUser } from "@fortawesome/free-solid-svg-icons"

const Navigation = ({ userObj }) => {
  return (
    <nav className="navigation">
      <ul className="navigation__list">
        <li>
          <Link 
            to="/"
            className="navigation__list--link"
          >
            <FontAwesomeIcon 
              icon={faTwitter}
              color={"#04AAFF"}
              size="2x" 
            />
          </Link>
        </li>
        <li>
          <Link 
            to="/profile"
            className="navigation__list--link"
          >
            <FontAwesomeIcon
              icon={faUser}
              color={"#04AAFF"}
              size="2x"
            />
            <span className="navigation__list--link-profile">{
              userObj.displayName 
              ? `${userObj.displayName}의 Profile` 
              : 'Profile'
            }</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation