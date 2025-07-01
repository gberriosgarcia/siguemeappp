
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

  /* --------------- CRUD Usuarios ------------------ */
  async addUser(usuario: string, correo: string, pass: string, fecha: string): Promise<void> {
    await this.init();
    await this.db!.executeSql(
      'INSERT INTO usuarios(usuario, correo, contrasena, fecha_nacimiento) VALUES(?, ?, ?, ?)',
      [usuario, correo, pass, fecha]
    );
  }

  async isValid(ident: string, pass: string): Promise<boolean> {
    await this.init();
    const res = await this.db!.executeSql(
      `SELECT 1 FROM usuarios WHERE (usuario = ? OR correo = ?) AND contrasena = ? LIMIT 1`,
      [ident, ident, pass]
    );
    return res.rows.length > 0;
  }

  async getPerfil(ident: string): Promise<Perfil | null> {
    await this.init();
    const res = await this.db!.executeSql(
      `SELECT usuario, correo FROM usuarios WHERE usuario = ? OR correo = ? LIMIT 1`,
      [ident, ident]
    );
    if (res.rows.length) {
      const item = res.rows.item(0) as any;
      return { usuario: item.usuario, correo: item.correo };
    }
    return null;
  }
}
