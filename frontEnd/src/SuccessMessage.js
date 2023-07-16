import './css/custom.css';
import './css/bootstrap.min.css';
import './font-awesome-4.7.0/css/font-awesome.min.css';

export default function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="successV">
    <div className="alert alert-success">
      <div className="flex-1">
        <label>{message}</label>
      </div>
    </div>
    </div>
  );
}
