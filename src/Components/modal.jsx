import "../Styles/modal.css";

const modal = ({ isOpen, onClose, onSubmit, name, setCategoryName }) => {
    if (!isOpen) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(); 
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label>Category Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        Add Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default modal;
