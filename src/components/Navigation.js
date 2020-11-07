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
            <span className="navigation__list--link-home brand-font-color">Home</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/profile"
            className="navigation__list--link"
          >
            {userObj.photoURL ? (
              <img src={userObj.photoURL} width="28" height="28" alt="profile image"/>
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                color={"#04AAFF"}
                size="2x"
              />
            )}
            <span className="navigation__list--link-profile brand-font-color">{
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