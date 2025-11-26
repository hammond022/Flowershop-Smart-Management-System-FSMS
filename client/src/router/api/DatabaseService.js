import api from "@/axios.js";

class DatabaseService {
  /**
   * Export the entire database
   * @param {string} password - User's password for verification
   * @returns {Promise<Object>} The exported database data
   */
  static async exportDatabase(password) {
    try {
      const response = await api.post("/database/export", { password });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Import database from exported data
   * @param {Object} data - The database data to import
   * @param {string} password - User's password for verification
   * @returns {Promise<Object>} Import result
   */
  static async importDatabase(data, password) {
    try {
      const response = await api.post("/database/import", { data, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate database data before import
   * @param {Object} data - The database data to validate
   * @param {string} password - User's password for verification
   * @returns {Promise<Object>} Validation result
   */
  static async validateDatabase(data, password) {
    try {
      const response = await api.post("/database/validate", { data, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download database as JSON file
   * @param {Object} data - The database data to download
   */
  static downloadAsFile(data) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `database_export_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Parse JSON file from user upload
   * @param {File} file - The JSON file to parse
   * @returns {Promise<Object>} Parsed database data
   */
  static async parseUploadedFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error("Invalid JSON file format"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsText(file);
    });
  }
}

export default DatabaseService;
