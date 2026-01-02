import CustomAlert from "../components/CustomAlert/CustomAlert.js";

class AlertService {
  constructor() {
    this.alert = new CustomAlert();
  }

  show(message, duration) {
    this.alert.show(message, duration);
  }
}

export default new AlertService();
