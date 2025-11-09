export class Format {

	formatHour(hour: string | undefined): string | undefined {
		if (!hour) return undefined; // O devuelve un valor por defecto si es necesario
		return hour.slice(0, 5); // Extrae las horas y minutos en el formato HH:mm
	}

	constructor() { }

	// Método utilitario
	formatDate(date: any): string {
		if (!date) return '';
		const d = new Date(date);
		const month = ('0' + (d.getMonth() + 1)).slice(-2);
		const day = ('0' + d.getDate()).slice(-2);
		return `${d.getFullYear()}-${month}-${day}`;
	}
}
