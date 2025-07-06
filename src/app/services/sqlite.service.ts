import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

export interface Perfil {
  usuario: string;
  correo: string;
}

@Injectable({ providedIn: 'root' })
export class SqliteService {
  private db: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {}

  /* ---------------- Inicializar BD ---------------- */
  private async init(): Promise<void> {
    if (this.db) return;
    this.db = await this.sqlite.create({ name: 'siguemeapp.db', location: 'default' });
    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        correo TEXT,
        contrasena TEXT,
        fecha_nacimiento TEXT
      )`,
      []
    );
  }

  /* --------------- Crear usuario ------------------ */
  async addUser(usuario: string, correo: string, pass: string, fecha: string): Promise<void> {
    await this.init();
    await this.db!.executeSql(
      'INSERT INTO usuarios(usuario, correo, contrasena, fecha_nacimiento) VALUES(?, ?, ?, ?)',
      [usuario.trim(), correo.trim().toLowerCase(), pass.trim(), fecha]
    );
    console.log('[SQLite] Usuario registrado:', usuario, correo);
  }

  /* --------------- Verificar credenciales --------- */
  async isValid(ident: string, pass: string): Promise<boolean> {
    await this.init();
    const res = await this.db!.executeSql(
      `SELECT * FROM usuarios WHERE (usuario = ? OR correo = ?) AND contrasena = ? LIMIT 1`,
      [ident, ident, pass]
    );
    console.log('[SQLite] Resultado validación:', res.rows.length, res.rows.item(0));
    return res.rows.length > 0;
  }

  /* --------------- Obtener perfil ------------------ */
  async getPerfil(ident: string): Promise<Perfil | null> {
    await this.init();
    const res = await this.db!.executeSql(
      `SELECT usuario, correo FROM usuarios WHERE usuario = ? OR correo = ? LIMIT 1`,
      [ident, ident]
    );
    if (res.rows.length) {
      const item = res.rows.item(0) as any;
      console.log('[SQLite] Perfil obtenido:', item);
      return { usuario: item.usuario, correo: item.correo };
    }
    return null;
  }

  /* --------------- Obtener todos los usuarios ----- */
  async getAllUsers(): Promise<void> {
    await this.init();
    const res = await this.db!.executeSql('SELECT * FROM usuarios', []);
    console.log(`[SQLite] Total usuarios encontrados: ${res.rows.length}`);
    for (let i = 0; i < res.rows.length; i++) {
      console.log('[SQLite] Usuario en BD:', res.rows.item(i));
    }
  }
}
