export function ResumenCards({ totalMes, gastoMes, ahorroMes }) {
  return (
    <div className="resumen-cards">
      <div className="Balance">
        <div className="BalanceTitle">
          <h1>Saldo Total</h1>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="icon icon-tabler icons-tabler-outline icon-tabler-building-bank"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
            </svg>
          </span>
        </div>
        <span className="amount">${totalMes.toLocaleString()}</span>
      </div>
      <div className="Balance">
        <div className="BalanceTitle">
          <h1>Gasto Mensual</h1>
          <span>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="icon icon-tabler icons-tabler-outline icon-tabler-moneybag-minus"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M9.5 3h5A1.5 1.5 0 0 1 16 4.5 3.5 3.5 0 0 1 12.5 8h-1A3.5 3.5 0 0 1 8 4.5 1.5 1.5 0 0 1 9.5 3" />
              <path d="M12.5 21H8a4 4 0 0 1-4-4v-1a8 8 0 0 1 15.943-.958M16 19h6" />
            </svg>
          </span>
        </div>
        <span className="spent">${gastoMes.toLocaleString()}</span>
      </div>
      <div className="Balance">
        <div className="BalanceTitle">
          <h1>Ahorro Mensual</h1>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="icon icon-tabler icons-tabler-outline icon-tabler-pig-money"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M15 11v.01M5.173 8.378a3 3 0 1 1 4.656-1.377" />
              <path d="M16 4v3.803A6.019 6.019 0 0 1 18.658 11h1.341a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1.342c-.336.95-.907 1.8-1.658 2.473V19.5a1.5 1.5 0 0 1-3 0v-.583a6.04 6.04 0 0 1-1 .083h-4a6.04 6.04 0 0 1-1-.083v.583a1.5 1.5 0 0 1-3 0v-2.027A6 6 0 0 1 8.999 7h2.5l4.5-3" />
            </svg>
          </span>
        </div>
        <span className="saving">${ahorroMes.toLocaleString()}</span>
      </div>
    </div>
  );
}
