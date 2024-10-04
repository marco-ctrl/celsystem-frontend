export class Format {

  formatHour(hour: string | undefined): string | undefined {
		if (!hour) return undefined; // O devuelve un valor por defecto si es necesario
		return hour.slice(0, 5); // Extrae las horas y minutos en el formato HH:mm
	}
  
  constructor() { }

}
