// src/components/Loader/Loader.jsx
import styles from './Loader.module.css'; // ← Importas los estilos

export function Loader() {
  return (
    <div className="flex justify-center items-center py-4">
      {/* Aplicas la clase del CSS Module */}
      <div className={styles.loader}></div>
    </div>
  );
}