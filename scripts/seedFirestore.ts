import * as admin from 'firebase-admin';
const serviceAccount = require('../firebase-service-account.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const auth = admin.auth();

const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
];

const DEMO_USERS = [
  { email: 'alice@demo.com', password: 'demo123', username: 'alice_demo', displayName: 'Alice Demo' },
  { email: 'bob@demo.com', password: 'demo123', username: 'bob_demo', displayName: 'Bob Demo' },
  { email: 'charlie@demo.com', password: 'demo123', username: 'charlie_demo', displayName: 'Charlie' },
  { email: 'diana@demo.com', password: 'demo123', username: 'diana_demo', displayName: 'Diana' },
  { email: 'eve@demo.com', password: 'demo123', username: 'eve_demo', displayName: 'Eve' },
];

async function seed() {
  console.log('🌱 Seed en cours...');
  const userIds: string[] = [];
  for (const u of DEMO_USERS) {
    try {
      let fu; try { fu = await auth.createUser({ email: u.email, password: u.password }); } catch { fu = await auth.getUserByEmail(u.email); }
      userIds.push(fu.uid);
      await db.collection('users').doc(fu.uid).set({ uid: fu.uid, username: u.username, displayName: u.displayName, bio: `Compte démo`, avatar: `https://picsum.photos/seed/${u.username}/200/200`, followersCount: 0, followingCount: 0, videosCount: 0, isPrivate: false, isVerified: false, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      console.log(`✅ User: ${u.username}`);
    } catch (e) { console.error(`❌ ${u.username}:`, e); }
  }
  for (let i = 0; i < 20; i++) {
    const authorId = userIds[i % userIds.length];
    const ref = db.collection('videos').doc();
    await ref.set({ videoId: ref.id, authorId, videoUrl: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length], thumbnailUrl: `https://picsum.photos/seed/v${i}/400/700`, description: `Vidéo démo #${i + 1} #demo #tiktok`, hashtags: ['demo', 'tiktok'], musicName: 'Son original', likesCount: Math.floor(Math.random() * 5000), commentsCount: 3, sharesCount: Math.floor(Math.random() * 200), viewsCount: Math.floor(Math.random() * 50000), duration: 15 + Math.floor(Math.random() * 45), isPublic: true, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    await db.collection('users').doc(authorId).update({ videosCount: admin.firestore.FieldValue.increment(1) });
    for (let c = 0; c < 3; c++) {
      const cRef = db.collection('videos').doc(ref.id).collection('comments').doc();
      await cRef.set({ commentId: cRef.id, authorId: userIds[(c + i) % userIds.length], text: `Super vidéo ! 🔥`, likesCount: 0, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    }
    console.log(`✅ Video ${i + 1}/20`);
  }
  for (let i = 0; i < userIds.length; i++) {
    const f = userIds[i], t = userIds[(i + 1) % userIds.length];
    await db.collection('users').doc(f).collection('following').doc(t).set({ followedAt: admin.firestore.FieldValue.serverTimestamp() });
    await db.collection('users').doc(f).update({ followingCount: admin.firestore.FieldValue.increment(1) });
    await db.collection('users').doc(t).update({ followersCount: admin.firestore.FieldValue.increment(1) });
  }
  console.log('🎉 Seed terminé !');
  process.exit(0);
}

seed().catch(e => { console.error('❌', e); process.exit(1); });
