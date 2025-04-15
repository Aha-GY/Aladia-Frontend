export default {
  admin: {
    course: {
      publish: 'Pubblica',
      reject: 'Rifiuta',
      published: 'è stato pubblicato!',
      rejected: 'è stato rifiutato!',
    },
    categories: {
      upper: 'CATEGORIE',
    },
    courses: {
      reviews: {
        upper: 'RECENSIONI DEI CORSI',
      },
    },
    content: {
      label: 'Contenuto',
      type: 'Tipo',
      unblock: 'Sblocca',
      entity: {
        type: 'Tipo di Entità',
        id: "ID dell'Entità",
      },
      moderation: {
        upper: 'MODERAZIONE DEI CONTENUTI',
        header: {
          userId: 'ID Utente',
          email: 'Email',
        },
      },
    },
    role: {
      title: 'Ruoli e Permessi',
      org: {
        title: "Ruoli nell'Organizzazione",
        admin: {
          title: "Amministratore dell'Organizzazione:",
          description:
            "Può eseguire una vasta gamma di azioni all'interno dell'organizzazione, con alcune limitazioni rispetto al Proprietario.",
        },
        member: {
          title: "Membro dell'Organizzazione:",
          description:
            'Ha permessi limitati, principalmente per visualizzare informazioni senza la possibilità di modificarle o eliminarle',
        },
        user: "Membro dell'Organizzazione:",
      },
      space: {
        title: 'Ruoli nello Spazio',
        supervisor: {
          title: 'Supervisore dello Spazio:',
          description:
            "Responsabile della gestione dei corsi e della creazione di nuove cartelle all'interno di uno spazio.",
        },
        coordinator: {
          title: 'Coordinatore dello Spazio:',
          description:
            'Gestisce lo spazio con meno permessi rispetto al Supervisore',
          description2:
            'Non può creare o eliminare corsi, ma può gestire le impostazioni dello spazio',
        },
        member: {
          title: 'Membro dello Spazio:',
          description:
            "Può solo visualizzare i contenuti all'interno dello spazio.",
        },
      },
      course: {
        title: 'Ruoli nei Corsi',
        observer: {
          title: 'Osservatore del Corso:',
          description: 'Ha pieno controllo sul corso',
        },
        teacher: {
          title: 'Insegnante:',
          description:
            'Può creare, modificare e gestire i corsi, ma non può eliminarli',
        },
        attendant: {
          title: 'Partecipante al Corso:',
          description:
            'Limitato alla visualizzazione dei corsi senza permessi di modifica o creazione',
        },
        owner: {
          title: 'Proprietario del Corso:',
          description:
            "Ha pieno controllo sui corsi all'interno del loro dominio, inclusa la creazione, l'aggiornamento e l'eliminazione dei corsi.",
        },
      },
      calendar: {
        title: 'Ruoli nel Calendario',
        participant: {
          title: 'Partecipante al Calendario:',
          description:
            'Limitato alla visualizzazione dei calendari, senza la possibilità di modificarli, crearli o eliminarli',
          description2:
            'Limitato alla visualizzazione degli eventi, senza la possibilità di modificarli, crearli o eliminarli',
        },
        scheduler: {
          title: 'Pianificatore del Calendario:',
          description:
            "Limitato alla visualizzazione e all'aggiornamento dei calendari senza permessi di eliminazione o creazione.",
          description2:
            "Ha pieno controllo sugli eventi all'interno del proprio calendario, inclusa la creazione, l'aggiornamento e l'eliminazione degli eventi.",
        },
        organizer: {
          title: 'Organizzatore del Calendario:',
          description:
            "Ha pieno controllo sui calendari, inclusa la creazione, l'aggiornamento e l'eliminazione dei calendari.",
          description2:
            "Ha pieno controllo sugli eventi all'interno del proprio calendario, inclusa la creazione, l'aggiornamento e l'eliminazione degli eventi.",
        },
      },
      event: {
        title: 'Ruoli negli Eventi',
        guest: {
          title: "Ospite dell'Evento:",
          description:
            'Limitato alla visualizzazione degli eventi, senza la possibilità di modificarli, crearli o eliminarli',
        },
        coHost: {
          title: "Co-Organizzatore dell'Evento:",
          description:
            "Limitato alla visualizzazione e all'aggiornamento degli eventi all'interno del proprio calendario senza permessi di eliminazione o creazione.",
        },
        host: {
          title: "Organizzatore dell'Evento:",
          description:
            "Ha pieno controllo sugli eventi all'interno del proprio calendario, inclusa la creazione, l'aggiornamento e l'eliminazione dei corsi.",
        },
      },
    },
  },
};
