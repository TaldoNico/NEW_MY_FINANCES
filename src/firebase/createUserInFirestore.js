import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const createUserInFirestore = async (user) => {
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  await setDoc(ref, {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email,
    photoURL: user.photoURL || "",
    createdAt: serverTimestamp(),
  }, { merge: true });

  console.log("Usuário salvo no Firestore!");
};
