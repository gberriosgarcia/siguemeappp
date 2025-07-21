// src/firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getAuth }       from 'firebase/auth';
import { getFirestore }  from 'firebase/firestore';
import { getDatabase }   from 'firebase/database';
import { getStorage }    from 'firebase/storage';
import { environment }   from './environments/environment';

// Inicializa la app Firebase con tu config
export const firebaseApp       = initializeApp(environment.firebaseConfig);
// Servicios
export const firebaseAuth      = getAuth(firebaseApp);
export const firebaseFirestore = getFirestore(firebaseApp);
export const firebaseDatabase  = getDatabase(firebaseApp);
export const firebaseStorage   = getStorage(firebaseApp);
