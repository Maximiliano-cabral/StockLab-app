# ⚡ StockLab - Sistema de Gestión de Inventario

![StockLab Logo](/public/SL.png) 

**StockLab** es una aplicación web progresiva (PWA) moderna diseñada para el control eficiente de inventarios, gestión de insumos químicos y trazabilidad de activos fijos (barriles). Construida con **React** y potenciada por **Firebase**, ofrece sincronización en tiempo real y un diseño totalmente responsivo adaptado para dispositivos móviles y escritorio.

---

## 🚀 Tecnologías Utilizadas

El proyecto está construido sobre un stack moderno y escalable:

*   **Frontend:** [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) (Rendimiento ultrarrápido).
*   **UI Framework:** [Ant Design (antd)](https://ant.design/) para componentes profesionales.
*   **Estilos:** CSS3 personalizado + Diseño Responsivo (Mobile First).
*   **Backend (BaaS):** [Firebase](https://firebase.google.com/).
    *   **Firestore:** Base de datos NoSQL en tiempo real.
    *   **Authentication:** Gestión de usuarios y seguridad.
*   **Manejo de Fechas:** [Day.js](https://day.js.org/).

---

## 🌟 Funcionalidades Principales

### 📊 Dashboard (Home)
*   Visualización de estadísticas en tiempo real.
*   **Alertas inteligentes:** Avisos automáticos de stock bajo (< 50 unidades).
*   Resumen de pedidos pendientes y estado de activos (barriles).
*   Gráficos y tarjetas interactivas con efectos visuales modernos.

### 📦 Gestión de Stock General
*   **CRUD Completo:** Crear, Leer, Editar y Eliminar productos.
*   **Buscador en tiempo real:** Filtrado instantáneo por nombre de insumo.
*   **Prevención de duplicados:** Lógica inteligente para unificar productos repetidos.
*   **Unidades dinámicas:** Soporte para Kilos, Toneladas, Litros, Cajas y Unidades.
*   Visualización de equivalencias (ej: cuántos bultos representan X kilos).

### 🚛 Entradas y Salidas
*   **Entradas:** Formulario optimizado para ingreso rápido de mercadería (sumas directas al stock).
*   **Salidas:** Calendario interactivo para visualizar pedidos programados por fecha.
*   Historial de movimientos.

### 🛢️ Control de Barriles (Activos Fijos)
*   Módulo exclusivo para el conteo de envases vacíos.
*   Separación visual entre barriles de **Metal** (Industrial) y **Plástico**.
*   Contadores gigantes con interfaz táctil para operarios.

### 🔐 Seguridad y Usuarios
*   **Autenticación:** Login seguro con correo y contraseña.
*   Persistencia de sesión automática.

---

## 📸 Capturas de Pantalla

| Dashboard PC |  |
|:---:|:---:|
| ![Dashboard](/public/home-dash.png)| 
| Stock General PC |  |
| ![Stock General](/public/stock-gene.png)|
| Entrada de Mercaderia PC |  |
| ![Entrada de Mercaderia](/public/entrada.png)|
| Salida de Pedidos PC |  |
| ![Salida de Pedidos](/public/salida.png)|
| Barriles Stock PC |  |
| ![Barriles Stock](/public/barriles.png)|
| Login PC |  |
| ![Login](/public/login.png)|

