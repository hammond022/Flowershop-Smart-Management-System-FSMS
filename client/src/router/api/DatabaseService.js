import api from "@/axios.js";

class DatabaseService {
  /**
   * Export the entire database with optional images
   * @param {string} password - User's password for verification
   * @param {boolean} includeImages - Whether to include images in export
   * @returns {Promise<Blob>} The exported database file (ZIP or JSON)
   */
  static async exportDatabase(password, includeImages = true) {
    try {
      const response = await api.post(
        "/database/export",
        { password, includeImages },
        { responseType: includeImages ? "blob" : "json" }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Import database from exported data (supports ZIP with images or JSON)
   * @param {File} file - The database file (ZIP or JSON)
   * @param {string} password - User's password for verification
   * @returns {Promise<Object>} Import result
   */
  static async importDatabase(file, password) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const response = await api.post("/database/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
   * Download file helper
   * @param {Blob} data - The file data to download
   * @param {string} filename - The filename to save as
   */
  static downloadFile(data, filename) {
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Download database as JSON file (without images)
   * @param {Object} data - The database data to download
   */
  static downloadAsFile(data) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    this.downloadFile(
      dataBlob,
      `database_export_${new Date().toISOString().split("T")[0]}.json`
    );
  }

  /**
   * Download database with images as ZIP
   * @param {Blob} zipData - The ZIP file data
   */
  static downloadDatabaseZip(zipData) {
    this.downloadFile(
      zipData,
      `database_export_${new Date().toISOString().split("T")[0]}.zip`
    );
  }

  /**
   * Download database as JSON only
   * @param {Object} jsonData - The database data
   */
  static downloadDatabaseJSON(jsonData) {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    this.downloadFile(
      dataBlob,
      `database_export_${new Date().toISOString().split("T")[0]}.json`
    );
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
