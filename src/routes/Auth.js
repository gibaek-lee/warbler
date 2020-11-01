import { authService, firebaseInstance } from "fbase"
import React from "react"
import AuthForm from "components/AuthForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons"

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target:{name}
    } = event
    let provider

    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider()
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider()
    }

    await authService.signInWithPopup(provider)
  }

  return (
    <div className="auth">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{marginBottom: 30}}
      />
      <AuthForm />
      <div className="auth__social">
        <button 
          className="auth__social-google"
          name="google"
          onClick={onSocialClick}
        >Continue with Google<FontAwesomeIcon icon={faGoogle} /></button>
        <button 
          className="auth__social-github"
          name="github"
          onClick={onSocialClick}
        >Continue with Github<FontAwesomeIcon icon={faGithub} /></button>
      </div>
    </div>
  )
}

export default Auth