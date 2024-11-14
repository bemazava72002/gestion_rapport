import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; // Assurez-vous d'importer l'instance axios correcte

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]); // Notifications à afficher progressivement
  const [showAll, setShowAll] = useState(false); // Afficher ou non toutes les notifications
  const [unreadCount, setUnreadCount] = useState(0); // Compteur des notifications non lues
  const [loading, setLoading] = useState(false); // Indicateur de chargement

  // Charger les notifications depuis le backend
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/logs/actions");

      // Assurez-vous que les données sont un tableau valide
      const data = Array.isArray(response.data) ? response.data : [];
      setNotifications(data);

      // Vérifier dans localStorage si des notifications ont déjà été lues
      const readNotifications = JSON.parse(localStorage.getItem("readNotifications")) || [];

      // Mettre à jour le compteur de notifications non lues en fonction des notifications non marquées comme lues
      const unread = data.filter(notification => !readNotifications.includes(notification.timestamp)).length;
      setUnreadCount(unread > 0 ? unread : 0);

      // Lancer l'affichage progressif des notifications après la récupération des données
      displayNotificationsProgressively(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  // Afficher progressivement les notifications (une par une)
  const displayNotificationsProgressively = (notifications) => {
    setLoading(true);
    let index = 0;

    // Ajouter chaque notification avec un délai
    const intervalId = setInterval(() => {
      if (index < notifications.length) {
        const notification = notifications[index];

        // Si notification existe et n'est pas undefined
        if (notification) {
          setDisplayedNotifications((prev) => {
            if (!prev.some(n => n.timestamp === notification.timestamp)) {
              return [...prev, notification];
            }
            return prev;
          });
          index++;
        }
      } else {
        clearInterval(intervalId); // Arrêter l'intervalle une fois toutes les notifications affichées
        setLoading(false);
      }
    }, 1000); // Afficher une notification chaque seconde
  };

  // Charger les notifications lors du montage du composant
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Limiter l'affichage des notifications (5 par exemple)
  const notificationsToShow = showAll ? notifications : displayedNotifications.slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Toutes les Notifications</h1>

      {unreadCount > 0 && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          Vous avez {unreadCount} notifications non lues.
        </div>
      )}

      {notificationsToShow.length === 0 ? (
        <div>Aucune notification à afficher.</div>
      ) : (
        <ul className="space-y-4">
          {notificationsToShow.map((notification) => (
            notification ? ( // Vérifiez que la notification existe
              <li key={notification.timestamp} className="flex items-center bg-gray-800 shadow-lg rounded-lg p-4 space-x-4">
                <div className="flex-shrink-0">
                  <i
                    className={`fas ${
                      notification.level === "info"
                        ? "fa-exclamation-circle text-blue-500"
                        : "fa-times-circle text-red-500"
                    } text-2xl`}
                  ></i>
                </div>

                <div className="flex-1">
                  {notification.action === "Création de rapport" ? (
                    <div>
                      <div className="font-bold text-sm">
                        {notification.message}
                      </div>
                      <div>
                        
                      </div>
                      <div className="text-sm text-gray-500"><i className="fas fa-note"></i>{notification.details.titre}</div>
                      <div className="text-sm text-gray-500"> <i className="fas fa-user"></i><span className="text-gray-400">Auteur: </span>{notification.utilisateur} </div>
                      <div className="text-sm text-gray-500"> <i className="fas fa-user"></i><span className="text-gray-400">Responsable: </span> {notification.details.responsable}</div>
                      <div className="text-xs text-gray-400 float-right">
                        <i className="fas fa-clock"></i>
                        {new Date(notification.date).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-bold text-sm">{"nouveau compte créée"}</div>
                      <div className="text-sm text-gray-500"> <i className="fas fa-user"></i><span className="text-gray-400">utilisateur: </span> {notification.utilisateur}</div>
                      
                      <div className="text-xs text-gray-400 float-right">
                        <i className="fas fa-clock"></i>
                        {new Date(notification.date).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ) : null // Si la notification est undefined, ne rien afficher
          ))}
        </ul>
      )}

      {notifications.length > 4 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-500"
          >
            {showAll ? "Voir moins" : "Voir toutes les notifications"}
          </button>
        </div>
      )}

      {loading && <div className="text-center mt-4">Chargement...</div>}
    </div>
  );
};

export default AllNotifications;
