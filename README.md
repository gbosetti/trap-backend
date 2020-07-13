# TrapBackend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.4.

## Setup

1. Import the database with PhpMyAdmin by using the `trap-backend/api/php_triage.sql` file.

2. Clone the project and install the dependencies:
```
git clone https://github.com/gbosetti/trap-backend
cd ./trap-backend
npm install
```

3. Place the `trap-backend/api/*` files in your server.

4. Update the `trap-backend/api/conexion.php` file with your database data.

5. Update the application `apiUrl` environment variable to match your server URL. Such variable is in both files placed in `trap-backend/src/environments/`.

6. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

7. If the database doesn't come with a default admin user, please use the register form to create your first user. Then, enable it by: 
`UPDATE usuarios_admins SET habilitado=1 WHERE 1`

8. Login in.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Mobile frontend

Available in https://github.com/gbosetti/trap-mobile

## Demos
https://www.youtube.com/playlist?list=PLHuNJBFXxaLDFt2sIIo-4rQIkes2s7WaN
