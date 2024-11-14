import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  // Charger les notifications depuis le backend
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/logs/actions");
      const data = Array.isArray(response.data) ? response.data : [];
      setNotifications(data);

      // Gérer les notifications non lues
      const readNotifications = JSON.parse(localStorage.getItem("readNotifications")) || [];
      const unread = data.filter(notification => !readNotifications.includes(notification.timestamp)).length;
      setUnreadCount(unread > 0 ? unread : 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Marquer toutes les notifications comme lues
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true,
      }));
      setNotifications(updatedNotifications);

      // Enregistrer les notifications lues dans localStorage
      const readNotifications = notifications.map(notification => notification.timestamp);
      localStorage.setItem("readNotifications", JSON.stringify(readNotifications));
      setUnreadCount(0);
    }
  };

  const handleViewAll = () => {
    navigate("/AllNotifications");  // Redirige vers la page des notifications
  };

  const notificationsToShow = showAll ? notifications : notifications.slice(0, 5);

  return (
    <div className="relative">
      {/* Icône de notification avec badge pour les notifications non lues */}
      <div onClick={toggleDropdown} className="cursor-pointer relative">
        <i className="far fa-bell"></i>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Menu déroulant des notifications */}
      {isOpen && (
        <div className="absolute  right-0 mt-2 w-80 bg-gray-800 text-white rounded shadow-lg z-50">
          <ul className="divide-y divide-gray-700">
            {notificationsToShow.map((notification) => (
              <li key={notification.timestamp} className="p-4 flex items-start">
                <div className="mr-4">
                  <i
                    className={`fas ${
                      notification.level === "info"
                        ? "fa-exclamation-circle text-blue-500"
                        : "fa-times-circle text-red-500"
                    }`}
                  ></i>
                </div>

                <div>
                  {notification.action === "Création de rapport" ? (
                    <div>
                      <div className="font-bold text-sm">{notification.message}</div>
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-note"></i> {notification.details.titre}
                      </div>
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-user"></i> <span className="text-gray-400">Auteur:</span> {notification.utilisateur}
                      </div>
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-user"></i> <span className="text-gray-400">Responsable:</span> {notification.details.responsable}
                      </div>
                      <div className="text-xs text-gray-400 float-right">
                        <i className="fas fa-clock"></i> {new Date(notification.date).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-bold text-sm">Nouveau compte créé</div>
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-user"></i> <span className="text-gray-400">Utilisateur:</span> {notification.utilisateur}
                      </div>
                      <div className="text-xs text-gray-400 float-right">
                        <i className="fas fa-clock"></i> {new Date(notification.date).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
            <li className="text-center py-2">
              <button onClick={() => navigate('/AllNotifications')} className="text-blue-500">
                Tous les notification
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
