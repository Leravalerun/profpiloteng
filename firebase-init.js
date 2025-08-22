// firebase-init.js
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
});

window.auth = firebase.auth();
window.db = firebase.firestore();

// пример: сохранить прогресс
window.saveProgress = async (role, day, status) => {
  const user = auth.currentUser;
  if (!user) return;
  await db.collection('users').doc(user.uid)
    .collection('progress').doc(role)
    .set({
      day,
      status, // "in_progress" | "done"
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
};
