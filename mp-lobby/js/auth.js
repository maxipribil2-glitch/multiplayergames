// MAP — login & register logic for index.html
import { app } from "./firebase-config.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore, doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegisterBtn = document.getElementById("show-register");
const showLoginBtn = document.getElementById("show-login");
const errorBox = document.getElementById("error-box");

function showError(msg) {
  errorBox.textContent = msg;
}

function friendlyError(err) {
  const code = err.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Login passt nicht — Email oder Passwort falsch.";
  }
  if (code.includes("email-already-in-use")) return "Diese Email ist schon registriert.";
  if (code.includes("weak-password")) return "Passwort zu kurz — min. 6 Zeichen.";
  if (code.includes("invalid-email")) return "Email-Format checken.";
  return "Was lief schief: " + (err.message || code);
}

showRegisterBtn.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  showError("");
});

showLoginBtn.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  showError("");
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("");
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // redirect happens in onAuthStateChanged below
  } catch (err) {
    showError(friendlyError(err));
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("");
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;

  if (username.length < 2) {
    showError("Username muss mind. 2 Zeichen haben.");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: username });
    await setDoc(doc(db, "users", cred.user.uid), {
      username,
      email,
      createdAt: serverTimestamp()
    });
    // redirect happens in onAuthStateChanged below
  } catch (err) {
    showError(friendlyError(err));
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "lobby.html";
  }
});
