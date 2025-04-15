export default {
  org: {
    label: 'Organizzazione',
    opening: 'Organizzazione in arrivo!',
    name: 'Organizzazione',
    title: "Cittadinanza Digitale: Lo Studio dell'Istruzione",
    remove: 'Rimuovi dall’Organizzazione',
    create: 'Crea',
    open: 'Apri',
    restore: 'Ripristina',
    report: 'Segnala',
    type: 'Tipo',
    delete: 'Elimina dall’Organizzazione',
    collapse: 'Comprimi',
    leave: 'Abbandona l’Organizzazione',
    detail: 'Dettagli dell’Organizzazione',
    owner: 'Proprietario',
    noTitle: '(Nessun titolo)',
    share: '{name} ha condiviso un link nella stanza {room}',
    identify: 'Identifica l’Organizzazione',
    viewAll: 'Vedi tutte le organizzazioni',
    deleteOrg: "Solo il proprietario dell'organizzazione può eliminarla!",
    validEmailField: 'The email address entered is not valid. Please try again',
    validWebsiteField:
      'The website address entered is not valid. Please try again',
    shared: {
      content:
        "Chiunque abbia il link può visualizzare le informazioni dell'organizzazione e creare nuovi Spazi, ma non sarà in grado di modificare le impostazioni.",
      contentCont:
        'in this {type} and will have access to it through the organization profile',
      edit: "Chiunque abbia il link potrà modificare le impostazioni dell'organizzazione, visualizzare tutte le informazioni e creare nuovi Spazi.",
      editCont:
        'in this {type} and will have access to it directly from their personal profile',
      invite: 'Invita come',
      notInvite: 'Invitare come',
      at: 'a',
      member: 'Membro',
      admin: 'Amministratore',
    },
    empty:
      "Sembra che non ci siano ancora utenti all'interno della tua organizzazione.",
    switch: {
      label: 'Cambia Account',
      content:
        "Passa a interagire come un profilo o un'organizzazione diversa. Scopri di più",
    },
    rate: {
      global: "Valutazione globale dell'organizzazione",
      reviews: 'Recensioni',
    },
    select: {
      role: "Seleziona ruolo dell'organizzazione",
    },
    attachment: {
      insert: 'Inserisci Allegato',
    },
    prompt: {
      switch: 'Cambia prompt',
    },
    description: {
      add: 'Aggiungi Descrizione Aggiuntiva',
    },
    titles: {
      medium: 'Media e di uso comune (8-15 parole)',
      short: 'Conciso e breve (2-8 parole)',
      descriptive: 'Descrittivo e lungo (15-25 parole)',
    },
    titleMap: {
      info: 'Info Chat',
      members: 'Membri',
      medias: 'Media, link e file',
      messages: 'Messaggi salvati',
      edit: 'Modifica',
    },
    invited: {
      none: 'Nessuno',
      label: 'Invitato',
      time: 'Invitato {time}',
      resend: 'Invia di nuovo l’invito',
      delete: 'Elimina invito',
      remove: 'Rimuovi',
    },
    color: {
      error: {
        hex: 'Formato HEX del colore non valido',
        rgb: 'Formato RGB del colore non valido',
        unsupported: 'Formato colore non supportato',
      },
    },
    role: {
      owner: 'Proprietario',
      administrator: 'Amministratore',
      member: 'Membro',
    },
    options: {
      details: 'Dettagli opzionali',
      select: 'Seleziona',
      save: 'Salva',
      open: 'Apri',
      links: 'Link',
      selected: '{count} membri',
    },
    media: {
      photoVideo: 'Foto&Video',
      files: 'File',
      shared: {
        links: 'Link condivisi',
      },
    },
    tab: {
      all: 'Tutto',
      rooms: 'Stanze',
      chats: 'Chat',
      groups: 'Gruppi',
      branches: 'Filiali',
      spaces: 'Spazi',
      users: 'Utenti',
      external: 'Esterno',
    },
    content: {
      verified: 'Verificato',
      block: 'Blocca',
    },
    activity: {
      log: 'Registro attività',
      roles: 'Ruoli',
      more: 'Altro...',
      unsaved: '{length} Non salvato',
      member: {
        label: 'Membri',
        count: '{count} Membri',
        invited: 'invitato',
        removed: 'rimosso',
        added: 'è stato aggiunto',
      },
      updated: {
        image: 'ha aggiornato la foto del gruppo',
        name: 'ha cambiato il nome del gruppo in',
        description: 'ha cambiato la descrizione del gruppo in',
        ownership: 'è diventato proprietario del gruppo',
      },
      user: {
        left: 'ha lasciato il gruppo',
      },
      room: {
        label: 'Stanze',
        mute: 'silenzia',
        unmute: 'riattiva audio',
        new: 'Nuova stanza',
      },
      group: {
        leave: 'Abbandona il gruppo',
        suggested: 'Suggerito',
        room: {
          new: 'Nuova stanza di gruppo',
        },
      },
      chat: {
        reply: 'rispondi',
        all: 'Tutte le chat',
        frequent: 'Chat frequenti',
        forwarded: 'Inoltrato da:',
        edited: 'modificato',
        info: 'Info',
        background: 'Sfondo chat',
        bookmark: 'Tutti i messaggi salvati',
        switch: 'Passa alla chat laterale',
        open: 'Apri chat laterale',
        delete: {
          label: 'Elimina chat',
          leave: 'Elimina e lascia',
        },
        setting: {
          notification: 'Notifiche',
          customize: 'Personalizza chat',
        },
        found: {
          rooms: 'Stanze trovate',
          messages: 'Messaggi trovati',
        },
        forward: {
          label: 'Inoltra messaggio',
          description: 'Inoltra {length} messaggi',
          from: 'da: ',
        },
        selected: {
          description: '{length} selezionato',
        },
        clear: {
          label: 'Pulisci chat',
          message: 'Sei sicuro di voler eliminare la chat?',
          leave:
            'Sei sicuro di voler eliminare tutta la cronologia dei messaggi e lasciare "{group}"?',
          dialog: 'Sei sicuro di voler eliminare tutti i messaggi della chat?',
          warning: 'Elimina messaggio selezionato?',
          delete: 'Elimina per me e {roomName}',
          everyone: 'Elimina per tutti',
          forAll: 'Questo eliminerà tutti i messaggi e i media in questa chat',
          forMe:
            'Questo eliminerà tutti i messaggi e i media in questa chat. Gli altri membri del gruppo li avranno ancora',
        },
        select: 'Seleziona messaggi',
        isTyping: '{name} sta scrivendo',
        story: {
          answered: 'Hai risposto a questa storia',
          replied: 'Ha risposto alla tua storia',
          unavailable: 'Storia non disponibile',
          shared: 'condiviso questa storia',
        },
      },
      message: {
        label: 'Messaggi',
        pinned: 'fissato',
        loading: 'caricamento messaggi...',
        unread: 'Messaggi non letti',
        reply: 'Rispondi',
        pin: 'Fissa',
        unpin: 'Rimuovi',
        forward: 'Inoltra',
        save: 'Salva',
        unsave: 'Non salvare',
        resend: 'Invia di nuovo',
        delete: 'Elimina',
        select: 'Seleziona',
        seen: 'Visto',
        see: 'vedi messaggio',
        goTo: 'Vai al messaggio',
        reactions: '{reactions}/{users} hanno reagito',
        pinnedM: 'Messaggi fissati',
        editM: 'Modifica messaggio',
        placeholder: 'Scrivi un messaggio...',
        saved: 'Messaggi salvati',
        notification: {
          label: 'Notifiche dei messaggi',
          reaction: 'Mostra notifiche delle reazioni',
        },
        send: {
          label: 'Invia messaggio',
          as: 'Invia messaggi come',
        },
        copy: {
          label: 'Copia',
          media: 'Copia media',
        },
        you: 'Tu',
        social: {
          share: {
            story: 'ha condiviso una storia',
            post: 'ha condiviso un post',
          },
          reply: {
            story: 'ha risposto a una storia',
          },
        },
      },
    },
    calendar: {
      allDay: 'Tutto il giorno',
      live: 'In diretta',
      event: {
        add: 'Aggiungi evento in altri calendari',
        location: 'Imposta un indirizzo',
      },
      setting: {
        title: 'Impostazioni',
        label: 'Impostazioni calendario',
        description: 'Imposta le impostazioni avanzate del calendario',
        schedule: 'Impostazioni di pianificazione',
        select: {
          duration: {
            label: 'Seleziona uno di questi',
            min: '{min} minuti',
            hour: '{hour} ora',
            total: 'Durata totale',
          },
          color: 'Seleziona un colore',
        },
      },
    },
    edit: {
      replicate: {
        label: 'Replica modifiche',
        description: 'Replica modifiche nei calendari condivisi',
        content: 'Seleziona gli elementi da replicare',
      },
    },
    room: {
      live: 'Sala conferenze',
      onPremise: 'Indirizzo luogo',
      description: 'Descrizione',
      attachments: 'Allegati',
      frequency: 'Frequenza',
      create: {
        new: 'Crea nuova stanza',
      },
      member: {
        add: 'Aggiungi membri',
      },
    },
    streaming: {
      range: 'Da {start} a {end}',
      live: 'In diretta',
      onPremise: 'In sede',
      minutes: {
        label: 'Streaming (minuti)',
        total: 'Minuti totali',
      },
      cost: {
        covered: 'Tutti i costi di streaming sono coperti',
      },
    },
    cost: {
      storage: {
        label: 'Archivio (Gb)',
        left: '{amount} rimanente per coprire i costi',
        total: 'Archivio totale',
      },
      payment: {
        due: 'Prossimo pagamento previsto',
      },
    },
    spaces: {
      empty:
        "Sembra che non ci siano ancora Spazi all'interno della tua organizzazione.",
    },
    settings: {
      label: 'Impostazioni',
    },
    status: {
      inProgress: 'In corso',
      completed: 'Completato',
      toDo: 'Da fare',
    },
    events: {
      leave: 'Abbandona',
      count: '{count} eventi in questo giorno',
      incoming: {
        title: '{amount} eventi in arrivo oggi',
        empty: 'Sembra che non ci siano eventi in arrivo oggi',
      },
      date: {
        change: {
          error: {
            next: 'Questo evento non può essere spostato in un’altra data',
            past: 'Questo evento non può essere spostato a una data precedente',
          },
        },
      },
    },
    courses: {
      label: 'Corsi',
      search: 'Cerca Corso',
      progress: '{current} di {total}',
      empty:
        'Sembra che non ci siano ancora corsi in programma nella tua organizzazione',
      type: {
        label: 'Tipo di Corso:',
        onDemand: 'Su richiesta',
      },
      lectures: {
        label: '{amount} lezioni',
        remaining: 'Lezioni rimanenti:',
        total: 'Totale lezioni:',
      },
      time: 'Intervallo di tempo',
    },
    filter: 'Filtra',
    user: {
      selected: 'Utente selezionato',
      total: 'Totale utenti',
    },
    dashboard: {
      create: 'Crea Dashboard',
      general: 'Dashboard generale',
      preview: 'Anteprima Dashboard generale',
      usage: 'Gestisci facilmente le attività quotidiane e imposta le priorità',
      time: {
        activity: 'Attività temporale:',
        range: 'Intervallo di tempo:',
        thisWeek: 'Questa settimana',
      },
      monitoring: {
        label: 'Dashboard di monitoraggio',
        activity: 'Attività di monitoraggio',
        preview: 'Anteprima Dashboard di monitoraggio',
        courses: {
          inProgress: 'Monitoraggio corsi in corso',
        },
        usage:
          'Favorisci la collaborazione visualizzando lo stato delle attività del team',
      },
      personalized: {
        label: 'Dashboard personalizzata',
        usage:
          'Crea la tua dashboard personalizzata, cercando tra tutti i widget',
        widgets: 'Aggiungi widget',
        templates: 'Nuovo modello',
        composed: 'Crea la tua Dashboard',
      },
    },
    hub: {
      payment: {
        income: 'Entrate',
        spending: 'Spese',
        balance: {
          total: 'Saldo Totale',
        },
        view: {
          details: 'Visualizza Dettagli',
          transactions: 'Visualizza Transazioni',
        },
      },
      date: {
        day: 'Giorno',
        week: 'Settimana',
        month: 'Mese',
        year: 'Anno',
        list: 'Elenco',
        today: 'Oggi',
      },
      task: {
        widget: {
          add: 'Aggiungi Widget',
          remove: 'Rimuovi Widget',
        },
        manage: {
          label: 'I {count} widget presenti sono:',
          description:
            'Gestisci facilmente le attività quotidiane e monitora le impostazioni generali dell’organizzazione',
          widgets: 'Widget Utente',
          maintenance: 'Manutenzione Spazi',
          payment: 'Grafico dei Pagamenti',
          qa: 'Grafico D&R',
          report: 'Report Corsi',
          review: 'Grafico Recensioni',
          event: 'Eventi in Arrivo',
        },
      },
      analytics: {
        event: {
          this: 'Questo evento',
          following: 'Questo e i successivi eventi',
          all: 'Tutti gli eventi',
          none: 'Nessun evento il',
        },
        user: {
          count: '{count} utenti',
        },
        payment: {
          income: 'Entrate',
          spending: 'Spese',
        },
        filter: {
          dialog: 'Su cosa vuoi concentrarti?',
          space: 'Spazi e corsi',
          time: 'Intervallo di Tempo',
          users: 'Utenti',
          clear: 'Cancella Tutto',
          user: 'Utente {filter}',
        },
        usage:
          'Questo widget ti permette di vedere quanti utenti ci sono nella tua organizzazione, chi è online e cosa stanno facendo',
        preview: {
          single: 'Anteprima Widget {name}',
          multiple: 'Anteprima {store}',
        },
        courses: {
          monitoring: 'Monitoraggio dei Corsi',
          report: 'Report Corsi',
        },
        qa: {
          report: 'Report D&R',
        },
        reviews: {
          report: 'Report Recensioni',
          positive: 'Positivo',
          negative: 'Negativo',
        },
        activity: {
          users: 'Attività degli Utenti',
        },
      },
    },
    search: {
      results: '{total} risultati per',
    },
    posts: {
      number: 'Numero di post',
      count: '{count} post',
    },
    members: {
      label: 'Membro',
      count: 'Numero di membri',
      none: 'Non disponibile',
      selected: '{count} membri',
    },
    employee: {
      count: 'Numero di dipendenti',
      members: '{count} dipendenti',
    },
    industry: {
      label: 'Settore',
    },
    about: {
      label: 'Informazioni',
      post: {
        label: 'Post',
      },
      course: {
        label: 'Corsi',
        all: 'Tutti i corsi',
        publish: 'Corso Pubblicato',
      },
      collaborator: {
        collaborators: 'Collaboratori',
      },
      member: {
        label: 'Membri',
        total: 'Totale membri',
      },
      review: {
        label: 'Recensioni',
      },
      reels: {
        label: 'Bobine',
      },
    },
    info: {
      label: 'Informazioni e Contatti',
      phone: 'Telefono',
      email: 'Email',
      industry: 'Settore',
      employer: 'Datore di lavoro',
      created: 'Data di creazione',
      general: 'Informazioni generali',
      country: 'Paese',
      city: 'Città',
    },
    assign: {
      license: 'Assegna licenza',
    },
    account: {
      delete: 'Elimina organizzazione',
      notFollower: 'Questo account non è tra i tuoi follower',
      keepAccount: 'Mantieni il conto',
      deleteAccount: 'Elimina account',
    },
    subscribe: {
      label: 'Iscriviti',
      notNow: 'Non ora',
      now: 'Iscriviti ora',
    },
    card: {
      add: 'Aggiungi nuova carta',
    },
    space: {
      new: 'Nuovo spazio',
      teacher: 'insegnante:',
    },
    manage: {
      column: 'Gestisci colonna',
    },
    payment: {
      payout: 'Pagamento',
    },
    schedule: {
      confirm: 'Conferma orario',
    },
    group: {
      title: 'Aggiungi titolo gruppo...',
      placeholder: 'cerca utenti da aggiungere...',
      details: 'Dettagli gruppo',
      created: 'Appena creato',
      add: 'Aggiungi al gruppo',
      disable: 'Sciogli gruppo',
      create: 'Crea',
      invite: {
        label: 'Invita',
        save: 'Save',
        send: 'Invia inviti',
      },
      role: {
        change: 'Cambia ruoli',
        supervisor: 'Supervisore',
        observer: 'Osservatore',
        billingMgr: 'Responsabile pagamenti',
      },
    },
    branches: {
      add: 'Add',
      search: 'Search Branch',
      addBranch: 'Add Branch',
      editBranch: 'Edit Branch',
      cancel: 'Cancel',
      save: 'Save',
      orgName: 'Organization Name',
      branchName: 'Branch Name',
    },
  },
};
