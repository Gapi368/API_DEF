import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

/**
 Credenciales de prueba:
 Admin: username: admin| password: Admin1234!
Developer:username: developer| password: Dev1234!
User:username: estudiante1 |password: User1234!
 */

async function runSeed() {
    const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '3306', 10), username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
        charset: 'latin1',
        synchronize: false,
    });

    await dataSource.initialize();
    console.log('📦 Conexión establecida. Iniciando seed...');

    const queryRunner = dataSource.createQueryRunner();

    try {
        //colores base
        const coloresSeed = [
            { nombre_color: 'Azul', codigo_color: '#4A90D9' },
            { nombre_color: 'Verde', codigo_color: '#27AE60' },
            { nombre_color: 'Rojo', codigo_color: '#E74C3C' },
            { nombre_color: 'Naranja', codigo_color: '#E67E22' },
            { nombre_color: 'Morado', codigo_color: '#8E44AD' },
            { nombre_color: 'Rosa', codigo_color: '#E91E8C' },
            { nombre_color: 'Amarillo', codigo_color: '#F1C40F' },
            { nombre_color: 'Cian', codigo_color: '#1ABC9C' },
        ];

        for (const color of coloresSeed) {
            const exists = await queryRunner.query(
                'SELECT id_color FROM Colores WHERE nombre_color = ?',
                [color.nombre_color],
            );
            if (!exists.length) {
                await queryRunner.query(
                    'INSERT INTO Colores (nombre_color, codigo_color) VALUES (?, ?)',
                    [color.nombre_color, color.codigo_color],
                );
                console.log(`Color creado: ${color.nombre_color}`);
            }
        }

        // usuarios base
        const usuariosSeed = [
            {
                nombre: 'Administrador',
                username: 'admin',
                correo: 'admin@estresapp.com',
                password: 'Admin1234!',
                role: 'ADMIN',
                apodo: 'Admin',
                carrera: 'Administración',
                semestre: '1ro',
                edad: 30,
            },
            {
                nombre: 'Developer Test',
                username: 'developer',
                correo: 'developer@estresapp.com',
                password: 'Dev1234!',
                role: 'DEVELOPER',
                apodo: 'Dev',
                carrera: 'Ingeniería en Sistemas',
                semestre: '8vo',
                edad: 25,
            },
            {
                nombre: 'Estudiante Demo',
                username: 'estudiante1',
                correo: 'estudiante@estresapp.com',
                password: 'User1234!',
                role: 'USER',
                apodo: 'Estu',
                carrera: 'Ingeniería en Sistemas',
                semestre: '5to',
                edad: 21,
            },
        ];

        for (const u of usuariosSeed) {
            const exists = await queryRunner.query(
                'SELECT id_usuario FROM Usuarios WHERE username = ?',
                [u.username],
            );

            if (!exists.length) {
                const hashed = await bcrypt.hash(u.password, 10);
                const result = await queryRunner.query(
                    'INSERT INTO Usuarios (correo, contrasena, username, nombre, role) VALUES (?, ?, ?, ?, ?)',
                    [u.correo, hashed, u.username, u.nombre, u.role],
                );
                const userId = result.insertId;

                // Crear perfil para cada usuario seed
                await queryRunner.query(
                    `INSERT INTO Perfil 
            (id_perfil, nombreC_nombre, nombreC_apellidos, edad, carrera, semestre_cursandose, apodo, puntosT_estres, racha, img_perfil, color_acompanante) 
           VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 1)`,
                    [userId, u.nombre.split(' ')[0], u.nombre.split(' ').slice(1).join(' ') || '-', u.edad, u.carrera, u.semestre, u.apodo, Buffer.from('default')],
                );

                console.log(`Usuario creado: ${u.username} (${u.role}) | password: ${u.password}`);
            } else {
                console.log(`Usuario ya existe: ${u.username}`);
            }
        }

        console.log('\nSeed completado exitosamente!');
        console.log('\nCredenciales de prueba:');
        console.log('  ADMIN:     admin / Admin1234!');
        console.log('  DEVELOPER: developer / Dev1234!');
        console.log('  USER:      estudiante1 / User1234!');
    } catch (error) {
        console.error('Error en seed:', error);
    } finally {
        await dataSource.destroy();
    }
}

runSeed();
