/**
 * @module Presentation
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var COLORS = {
  primaryHex: "0C5B8BCC",
  primary: "rgba(12, 91, 139, 0.8)",
  second: "white",
  text: "black",
  gray: "lightslategray",
  transparent: "rgba(1,1,1,0)",
  error: "rgba(168, 0, 0, 0.8)",
  transparentBlack: "rgba(1,1,1,0.1)",
  warn: "rgba(255, 161, 45, 0.8)"
};

exports.scales = {
  elevation: 1,
  pixelsCursor: 5,
  pixelsZone: 30,
  cloudyPixelPercentage: 25
};

exports.style = {
  color: COLORS,
  panel: {
    padding: "0px 0px 0px 0px"
  },
  root: {
    width: "450px",
    padding: "0px 0px 10px 0px"
  },
  cursor: {
    longitud: -83.4163805573461,
    latitud: 9.08595915840644,
    zoom: 8
  },
  point: {
    color: COLORS.second,
    transparency: 1
  },
  geometry: {
    color: COLORS.primaryHex,
    transparency: 0.8,
    zoom: 10
  },
  header: {
    title: {
      fontWeight: "bold",
      fontSize: "30px",
      color: COLORS.primary,
      backgroundColor: COLORS.transparent,
      textAlign: "center",
      margin: "0px",
      width: "100%"
    },
    subtitle: {
      padding: "7px",
      fontSize: "16px",
      color: COLORS.text,
      backgroundColor: COLORS.transparent,
      textAlign: "center",
      margin: "0px",
      width: "100%"
    },
    panel: {
      backgroundColor: COLORS.transparent,
      padding: "7px 0px 0px 0px"
    }
  },
  button: {
    position: "top-center",
    padding: "7px 0px 0px 0px"
  },
  message: {
    title: { fontWeight: "bold" }
  },
  line: {
    title: {
      color: COLORS.second, backgroundColor: COLORS.transparent,
      fontWeight: "bold",
      width: "90%",
      padding: "9px 0 0 15px",
      margin: "0"
    },
    button: {
      padding: "0",
      margin: "0"
    },
    panel: { backgroundColor: COLORS.primary, padding: "0", height: "35px" }
  },
  data: {
    title: {
      color: COLORS.text, backgroundColor: COLORS.transparent,
      fontWeight: "bold",
      padding: "0px 0px 0px 0px",
      width: "96%",
      textAlign: "center"
    },
    subtitle: {
      color: COLORS.text, backgroundColor: COLORS.transparent,
      fontWeight: "bold",
      padding: "0px 0px 0px 0px",
      width: "96%",
      textAlign: "center"
    },
    label: {
      color: COLORS.text,
      fontWeight: "bold"
    },
    panel: {
      backgroundColor: COLORS.gray,
      padding: "0px 0px 0px 0px"
    },
  },
  input: {
    label: {
      fontWeight: "bold",
      width: "25%",
      padding: "7px 0px 0px 0px",
      backgroundColor: COLORS.transparent
    },
    panel: {
      width: "55%"
    }
  },
  textbox: {
    label: {
      fontWeight: "bold",
      width: "25%",
      padding: "7px 0px 0px 0px",
      backgroundColor: COLORS.transparent
    },
    panel: {
      width: "55%",
      textAlign: "right"
    }
  },
  visualization: {
    transparency: {
      width: "67%",
      margin: "16px 8px 8px 8px"
    },
    mapType: {
      width: "55%"
    },
    palette: {
      min: {
        margin: "5px 10px 0px 0px",
        width: "40px",
        textAlign: "end"
      },
      colors: {
        stretch: "horizontal",
        margin: "0px",
        Height: "25px",
        width: "67.5%"
      },
      max: {
        margin: "5px 0px 0px 10px",
        width: "40px"
      },
      description: {
        margin: "5px 0px 0px 10px",
        width: "90%"
      },
      panel: {
        padding: "8px",
        margin: "0px -50px 0px -50px"
      }
    },
    zoom: {
      width: "67%",
      margin: "16px 8px 8px 8px"
    },
  },
  guide: {
    panel: { backgroundColor: COLORS.transparentBlack },
    button: {},
  },
  alert: {
    stack: {
      position: "bottom-right",
      backgroundColor: "rgba(1,1,1,0)"
    },
    panel: {
      backgroundColor: "white",
      margin: "10px 0px 0px 0px",
      padding: "0px",
      maxWidth: "480px",
      minWidth: "300px"
    },
    title: {
      fontWeight: "bold",
      color: "white",
      margin: "0px",
      padding: "10px",
      width: "100%"
    },
    message: {
      backgroundColor: "rgba(1,1,1,0)",
      margin: "0px",
      padding: "10px",
      whiteSpace: "pre"
    }
  }
};

exports.label = {
  title: "SISAGRO",
  subtitle: "Sistema de Visualización Agroclimatológica",
  loading: "Cargando los datos...",
  loadingInterface: "Cargando la interfaz....",
  filter: {
    title: "Filtros",
    reportType: "Reporte",
    zone: "Zona",
    indicator: "Indicador",
    countYears: "Serie",
    year: "Año",
    typeOutput: "Salida",
    longitude: "Longitud",
    latitude: "Latitud",
    separator: ":",
    point: "Punto"
  },
  visualization: {
    transparency: "Transparencia",
    mapType: "Mapa",
    palette: "Colores",
    zoom: "Acercar",
    description: "Nota"
  },
  button: {
    search: "Buscar"
  },
  line: {
    filter: "Filtros",
    visualization: "Visualización",
    information: "Información",
    userGuide: "Guía de Usuario",
    about: "Acerca de"
  },
  alert: {
    succ: "Información",
    warn: "Alerta",
    err: "Error"
  }
};

exports.message = {
  error: {
    initApplication: "Ocurrió el siguiente error al iniciar la aplicación:\n\t",
    initInterface: "Ocurrió el siguiente error al iniciar la interfaz:\n\t",
    loadPoint: "Ocurrió el siguiente error al cargar los datos del punto seleccionado:\n\t",
    loadLayer: "Ocurrió el siguiente error al cargar los datos de la capa:\n\t"
  },
  information: {
    incompledFunction: "Función en desarrollo...",
    outsideZone: "Debe dar click en algún punto dentro de la región delimitada",
    emptyResult: "No se encontraron resultados según los parámetros ingresados"
  }
};
