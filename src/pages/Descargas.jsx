import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/descargas.css";

export const Descargas = () => {
  const { gastosRaw, loadingGastos, currentCycleId, cicloData } = useAuth();

  // Función común para preparar los datos y el título
  const prepararPayload = () => {
    const gastosCiclo = gastosRaw.filter((g) => g.ciclo_id === currentCycleId);

    // Forzamos el uso de UTC para que no reste horas y cambie el día
    const fechaInicio = cicloData
      ? new Date(cicloData.fecha_inicio).toLocaleDateString("es-ES", {
          timeZone: "UTC",
        })
      : "";

    const fechaFin = cicloData?.fecha_fin
      ? new Date(cicloData.fecha_fin).toLocaleDateString("es-ES", {
          timeZone: "UTC",
        })
      : "Actualidad";

    return {
      movimientos: gastosCiclo,
      titulo: `REPORTE DE CICLO: ${fechaInicio} - ${fechaFin}`,
      // Para el nombre del archivo reemplazamos las barras por guiones
      fechaInicio: fechaInicio.replace(/\//g, "-"),
    };
  };

  const handleExport = async (tipo) => {
    const payload = prepararPayload();

    if (payload.movimientos.length === 0) {
      alert("No hay movimientos en este ciclo para exportar.");
      return;
    }

    // Definimos la configuración según el tipo (Excel o PDF)
    const config = {
      excel: {
        url: "https://finance-api-up1k.onrender.com/api/export-excel", // <--- NUEVA URL
        ext: "xlsx",
        // ...
      },
      pdf: {
        url: "https://finance-api-up1k.onrender.com/api/export-pdf", // <--- NUEVA URL
        ext: "pdf",
        // ...
      },
    };

    try {
      const response = await fetch(config[tipo].url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movimientos: payload.movimientos,
          titulo: payload.titulo,
        }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Reporte_${payload.fechaInicio}.${config[tipo].ext}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
      alert(`No se pudo generar el ${tipo.toUpperCase()}. Revisa la API.`);
    }
  };

  return (
    <div className="descargas-container">
      <h1>Centro de Descargas</h1>
      <p>Genera reportes detallados de tus movimientos.</p>

      <div className="download-cards">
        {/* TARJETA EXCEL */}
        <div className="download-card">
          <div className="icon">📊</div>
          <h3>Excel Pro</h3>
          {loadingGastos ? (
            <p>Sincronizando...</p>
          ) : (
            <p>
              {gastosRaw.filter((g) => g.ciclo_id === currentCycleId).length}{" "}
              movimientos del ciclo.
            </p>
          )}
          <button
            onClick={() => handleExport("excel")}
            className="btn-download"
            disabled={loadingGastos}
          >
            Descargar XLSX
          </button>
        </div>

        {/* TARJETA PDF */}
        <div className="download-card">
          <div className="icon">📄</div>
          <h3>Reporte PDF</h3>
          <p>Formato elegante listo para imprimir o enviar.</p>
          <button
            onClick={() => handleExport("pdf")}
            className="btn-download"
            disabled={loadingGastos}
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};
