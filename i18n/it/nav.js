export default {
  nav: {
    footer: 'Footer',
    header: {
      and: 'e',
      people: 'Persone',
      menu: 'App',
      visited: 'ha visitato il tuo profilo',
      time: {
        prefix: 'ultimo accesso',
        now: '{prefix} pochi istanti fa',
        minute: '{diffInMinutes} minuto fa',
        hour: '{diffInHours} ora fa',
        days: '{days} giorno fa',
        minutes: '{prefix} {diffInMinutes} minuti fa',
        hours: '{prefix} {diffInHours} ore fa',
        day: '{days} giorni fa',
        min: '{min} min fa',
      },
      actions: {
        quick: 'Azioni rapide',
        accept: 'Accetta',
        decline: 'Rifiuta',
        goTo: 'Vai a',
      },
      declined: 'Rifiutato',
      accepted: 'Accettato',
      search: {
        label: 'Cerca',
        hint: 'Cerca {type}...',
        trending: 'Argomenti di domande più cercati',
        result: {
          viewAll: 'Mostra tutti i risultati della ricerca',
        },
        menu: {
          all: 'Tutti',
          courses: 'Corsi',
          profiles: 'Profili',
          posts: 'Post',
          question: 'Domanda su',
          user: 'Utente',
          replies: 'Risposte',
          participants: 'Partecipanti',
        },
      },
      profile: {
        label: 'Profili',
        clear: 'Cancella tutto',
        status: {
          inactive: 'Inattivo da oltre un mese',
        },
        visitors: 'Visitatori del tuo profilo',
        visited: 'ha visitato il tuo profilo',
      },
      update: {
        status: 'Stato:',
        id: 'ID:',
        time: 'Ora:',
        ip: 'Indirizzo IP:',
        api: 'API:',
        source: 'Fonte:',
        idemp: 'Idemp:',
        origin: 'Origine:',
        show: 'Mostra di più',
        today: 'Oggi',
        yesterday: 'Ieri',
        later: 'Più tardi',
        older: 'Più vecchio',
        thisWeek: 'Questa settimana',
      },
      notification: {
        settings: 'Impostazioni notifiche',
        reset: {
          name: 'Ripristina',
          title: 'Ripristina notifiche',
          content:
            'Questa azione ripristinerà tutte le impostazioni delle notifiche ai valori predefiniti',
          confirmation: 'Sei sicuro di voler procedere?',
        },
        alert: {
          enable: 'Abilita avvisi',
          disable: 'Disabilita avvisi',
        },
        list: {
          title: 'Notifiche',
          markAllAsRead: 'Segna tutto come letto',
          markRead: 'Segna come letto',
        },
        actions: {
          like: 'ha messo "Mi piace" al tuo post',
          shared: 'ha condiviso il tuo post',
          quizRem: 'ti ha inviato un promemoria quiz',
          default: '{slotOpen}{typeDesc}{slotClosed} {placeholder}',
          folder: {
            updated:
              '{slotOpen}ha modificato {slotClosed} {placeholderName} {slotOpen}in {slotClosed} {placeholderText}',
            removed:
              '{slotOpen}ha rimosso {slotClosed} {placeholderName} {slotOpen}da {slotClosed} {placeholderText}',
          },
          follower: {
            single: 'ha iniziato a seguirti',
            mutual: 'ha iniziato a seguirti anche',
            unFollow: 'ha smesso di seguirti',
            multiple:
              '{slotOpen}e {slotClosed} altre {senderCount} persone {slotOpen}hanno iniziato a seguirti {slotClosed}',
            two: '{slotOpen}e {slotClosed} {name} {slotOpen}hanno iniziato a seguirti {slotClosed}',
          },
          visitor: {
            single: 'ha visitato il tuo profilo',
            multiple:
              '{slotOpen}e {slotClosed} altre {senderCount} persone {slotOpen}hanno visitato il tuo profilo {slotClosed}',
            two: '{slotOpen}e {slotClosed} {name} {slotOpen}hanno visitato il tuo profilo {slotClosed}',
          },
          story: {
            created:
              "ho appena pubblicato una nuova storia, dai un'occhiata per non perderti il ​​contenuto!",
            reacted: 'ha reagito alla tua storia',
          },
          course: {
            created: 'ha creato un corso',
            updated: 'ha aggiornato un corso',
            review:
              '{slotOpen}Congratulazioni, il tuo corso {slotClosed} {placeholderName} {slotOpen}è ora sul mercato.{slotClosed}',
            published: 'ha richiesto la tua revisione per il corso',
            payment:
              '{slotOpen}ha pagato la rata {slotClosed} {currentInstallment} {slotOpen}di {slotClosed} {totalInstallment} {slotOpen}per {slotClosed} {quantity} {slotOpen}licenze del tuo {slotClosed} {text}',
            subscribe:
              '{slotOpen}ha pagato la quota di abbonamento {slotClosed}{placeholderQuantity} {slotOpen}per il tuo {slotClosed}{placeholderText}',
            enroll:
              '{slotOpen}si è iscritto al tuo {slotClosed} corso gratuito {slotOpen}{placeholderText} {slotClosed}',
            purchased:
              '{slotOpen}ha acquistato {slotClosed}{placeholderQuantity} {slotOpen}del tuo corso {slotClosed} {placeholderText}',
            member: {
              remove: 'ti ha rimosso da',
              invited: 'ti ha invitato nel',
              roleUpdate: 'ha modificato il tuo ruolo nel corso in',
              invite: {
                accept: 'ha accettato il tuo invito nel corso',
                decline: 'ha rifiutato il tuo invito nel corso',
              },
            },
            generation: {
              successLabel:
                '{placeholderText} {slotOpen}{typeDesc} {slotClosed}',
              success: 'generato con successo',
              failure: 'generazione del corso non riuscita. Riprova',
            },
          },
          assignment: {
            new: 'ha creato un nuovo compito',
          },
          post: {
            mentioned: 'ti ha menzionato in un post',
            commented: 'ha commentato il tuo post',
            reacted: 'ha reagito al tuo post',
            created: 'ha creato un post',
          },
          comment: {
            mentioned: 'ti ha menzionato in un commento',
            reacted: 'ha reagito al tuo commento',
            replied: 'ha risposto al tuo commento',
          },
          question: {
            single:
              '{slotOpen}ha impostato {slotClosed} {placeholder} {slotOpen}come risolto{slotClosed}',
            created: 'ha creato una domanda',
            category: 'ha creato una domanda sulla categoria',
            course: 'ha creato una domanda sul tuo corso',
            solved: 'ha risolto la tua domanda',
            allSolved: 'ha risolto tutte le tue domande',
          },
          answer: {
            created: 'ha risposto alla tua domanda',
            teacher: 'l’insegnante ha risposto alla tua domanda',
            best: 'ha segnato la tua risposta come la migliore',
          },
          review: {
            created: 'ha recensito il tuo corso',
            commented: 'ha risposto alla tua recensione',
          },
          certificate: {
            got: 'ha ottenuto un',
          },
          experience: {
            work: 'ha aggiunto una nuova esperienza lavorativa',
            ongoing: {
              work: 'ha iniziato una nuova esperienza lavorativa',
              education: 'ha iniziato una nuova esperienza educativa',
            },
            education: 'ha aggiunto una nuova esperienza educativa',
          },
          space: {
            deleted: 'ha eliminato lo spazio',
            updated: 'ha aggiornato lo spazio',
            member: {
              removed: 'ti ha rimosso dallo spazio',
              invited: 'ti ha invitato allo spazio',
              roleUpdate: 'ha modificato il tuo ruolo nello spazio in',
              invite: {
                accept: 'ha accettato il tuo invito nello spazio',
                decline: 'ha rifiutato il tuo invito nello spazio',
              },
            },
          },
          content: {
            remove:
              'Il tuo {entityType} è stato rimosso per violazione delle norme',
          },
          teacher: {
            become: 'Congratulazioni! Ora sei un insegnante',
          },
          user: {
            banned:
              'Il tuo account è stato sospeso per violazione dei termini di servizio',
          },
          profile: {
            complete: 'Congratulazioni! Hai completato il tuo profilo',
            incomplete:
              'Il tuo profilo è incompleto. Completalo per usufruire dell’esperienza completa',
          },
          calendar: {
            deleted: 'ha eliminato il calendario',
            updated: 'ha aggiornato il calendario',
            member: {
              invited: 'ti ha invitato al calendario',
              roleUpdate: 'ha aggiornato il tuo ruolo nel calendario a',
              removed: 'ti ha rimosso dal calendario',
              invite: {
                accept: 'ha accettato il tuo invito nel calendario',
                decline: 'ha rifiutato il tuo invito nel calendario',
              },
            },
          },
          streaming: {
            limitExceeded: 'Hai esaurito tutti i tuoi minuti di streaming',
          },
          token: {
            limitExceeded: 'Hai esaurito tutti i tuoi token AI',
          },
          storage: {
            limitExceeded: 'Hai esaurito lo spazio di archiviazione',
          },
          organization: {
            deleted: 'ha eliminato l’organizzazione',
            create: 'Congratulazioni! Hai creato una nuova organizzazione',
            onboardingComplete:
              'La configurazione della tua organizzazione è completa',
            member: {
              invited: 'ti ha invitato all’organizzazione',
              roleChange: 'ha aggiornato il tuo ruolo nell’organizzazione a',
              removed: 'ti ha rimosso dall’organizzazione',
              invite: {
                decline: 'ha rifiutato il tuo invito nell’organizzazione',
                accept: 'ha accettato il tuo invito nell’organizzazione',
              },
            },
            branch: {
              invited: 'ti ha invitato a essere il suo ramo',
              invite: {
                decline: 'ha rifiutato il tuo invito al ramo',
                accept: 'ha accettato il tuo invito al ramo',
              },
            },
          },
          event: {
            created:
              '{slotOpen}ha creato {slotClosed} {placeholderText} {slotOpen}in {slotClosed} {placeholderName}',
            updated:
              '{slotOpen}modificato questo evento {slotClosed} {placeholderText} ',
            deleted:
              '{slotOpen}ha rimosso {slotClosed} {placeholderText} {slotOpen}da {slotClosed} {placeholderName}',
            member: {
              invited: 'ti ha invitato all’evento',
              invite: {
                accept: 'ha accettato il tuo invito all’evento',
                decline: 'ha rifiutato il tuo invito all’evento',
              },
            },
          },
        },
        view: {
          general: 'Visualizzazioni Generali',
        },
        banner: {
          course: {
            name: 'Corsi',
            best: 'Migliori corsi',
            title: 'Crea corso',
            content:
              'Progetta facilmente corsi coinvolgenti con video, file ed elementi interattivi. Scegli tra corsi on-demand o in diretta',
            btnText: 'Nuovo Corso',
          },
          question: {
            title: 'Crea Domanda',
            content:
              'Ottieni risposte alle tue domande specifiche da una comunità attiva e specializzata pronta a condividere conoscenza e approfondimenti. Approfondisci qualsiasi argomento e ricevi feedback esperto in tempo reale!',
            btnText: 'Fai una domanda',
          },
          space: {
            name: 'Spazio',
            title: 'Crea Spazio',
            content:
              'La nostra piattaforma offre {spaceHtmlOpen} spazio {spaceHtmlClosed} dove gli utenti possono memorizzare, organizzare e condividere i propri corsi in cartelle personalizzabili. Collabora facilmente con altri condividendo contenuti direttamente sulla piattaforma',
            btnText: 'Nuovo Spazio',
          },
          payment: {
            name: 'Pagamento',
          },
          event: {
            title: 'Crea Evento',
          },
          chat: {
            name: 'Chat',
            personal: 'Personale',
            message: 'Messaggio',
            title: 'Crea Sala Chat',
          },
          notice: {
            name: 'Avviso',
          },
          setting: {
            name: 'Impostazioni',
          },
          post: {
            name: {
              singular: 'Post',
              plural: 'Post',
            },
            title: 'Crea Post',
            suggested: 'Post suggeriti per te',
          },
        },
        organization: {
          name: {
            singular: 'Organizzazione',
            plural: 'Organizzazioni',
          },
        },
        user: {
          name: 'Utenti',
          verified: 'Verificato',
          viewAll: 'Vedi tutto',
          featured: 'Utenti in evidenza',
        },
        teacher: {
          title: 'Insegnante',
          content: 'Crea un corso, fai una domanda o crea uno spazio',
        },
      },
      notificationDesc: {
        calendar: {
          event: {
            update: 'Aggiornamenti Evento',
            created: 'Ricevi una notifica per ogni nuovo evento creato',
            deleted: 'Ricevi una notifica quando un evento viene eliminato',
            modified: 'Ricevi una notifica per ogni modifica agli eventi',
            reminder: {
              upcoming:
                'Promemoria per un evento imminente, con possibilità di includere il corso correlato',
              missed:
                'Ricevi una notifica per eventi mancati, con possibilità di includere il corso associato',
              invitations:
                'Notifica quando vieni aggiunto/invitato a un evento o a un calendario',
            },
          },
        },
        course: {
          purchased: 'Ricevi una notifica per ogni acquisto del tuo corso',
          enrollment: {
            new: 'Notifica per ogni nuovo corso aggiunto alla piattaforma',
            updated: 'Notifica per aggiornamenti sui corsi a cui sei iscritto',
            startingSoon: 'Promemoria per i corsi in avvio a breve',
          },
          yours: {
            missed: 'Notifica per lezioni o sessioni perse nel tuo corso',
            new: 'Notifica per nuovi corsi nelle categorie di tuo interesse',
            tagged: 'Notifica per quando il tuo corso viene taggato',
            suspended:
              'Notifica se un corso a cui sei iscritto o che insegni viene sospeso per vari motivi',
          },
        },
        payment: {
          upcoming: 'Promemoria per pagamenti imminenti',
          installment:
            'Notifica per ogni pagamento rateale ricevuto per il tuo corso',
          subscriptionFee:
            'Notifica per ogni pagamento della quota di abbonamento',
          report: {
            monthly: 'Resoconto mensile delle tue entrate e uscite',
            weekly: 'Resoconto settimanale delle tue entrate e uscite',
          },
          transaction: {
            received: 'Notifica per ogni pagamento ricevuto',
            sent: 'Notifica per ogni pagamento inviato',
            successful: 'Notifica per ogni transazione riuscita',
          },
          issue: {
            failed: 'Notifica per pagamenti non riusciti',
            refund: 'Notifica per rimborsi ricevuti',
            subscriptionRenewal: 'Promemoria per i rinnovi degli abbonamenti',
          },
          offer: {
            special: 'Notifica per offerte e sconti speciali',
          },
        },
        question: {
          solved: 'Notifica per domande a cui hai partecipato risolte',
          answer: {
            new: 'Notifica per nuove risposte alle tue domande',
            markedAsBest: 'Notifica per risposte selezionate come migliori',
            teacher: 'Notifica per risposte di un insegnante alle tue domande',
            all: 'Notifica per tutte le tue domande in attesa di risposta',
          },
          inCourse: 'Notifica per nuove domande sui tuoi corsi',
          inCategory: 'Notifica per nuove domande in categorie che segui',
        },
        review: {
          new: 'Notifica per ogni recensione del tuo corso',
          updated: 'Notifica per modifiche alle recensioni sul tuo corso',
          comment: 'Notifica per commenti alle tue recensioni',
          teacher: {
            responded:
              'Notifica per risposte di un insegnante alle tue recensioni',
          },
        },
        social: {
          connection: {
            follow: 'Notifica quando qualcuno inizia a seguirti',
            contact: 'Notifica per richieste di contatto o accettazioni',
          },
          interaction: {
            title: 'Notifica per like, commenti o risposte ai tuoi post',
            repost: 'Notifica per ogni condivisione dei tuoi contenuti',
            mention: 'Notifica per menzioni nei post',
          },
          profile: {
            visited: 'Notifica per visite al tuo profilo',
            updated: 'Notifica per attività di persone che segui',
          },
        },
        space: {
          deleted: 'Notifica per cancellazione di uno spazio di cui fai parte',
          edited:
            'Notifica per modifiche a spazi di cui fai parte, inclusi cambi di nome',
          storage:
            'Notifica per quando lo spazio di archiviazione gratuito sta per esaurirsi',
          invitation: {
            sent: 'Notifica per inviti a spazi, cartelle o corsi',
            status: 'Notifica per accettazione o rifiuto di un invito',
            added:
              'Notifica per nuovi membri aggiunti in spazi, cartelle o corsi',
            removed: 'Notifica per membri rimossi da spazi, cartelle o corsi',
          },
          role: {
            changed: 'Notifica per cambiamenti del tuo ruolo in uno spazio',
            assigned:
              'Notifica per cambi di ruolo assegnati ad altri in uno spazio',
          },
        },
        system: {
          profile: {
            ban: 'Notifica per sospensione dell’account',
            becomeTeacher: 'Notifica per esito della domanda di insegnante',
            completed:
              'Notifica per completamento del profilo e accesso completo',
            inComplete:
              'Promemoria per completare il profilo se mancano informazioni',
            suspend: {
              payment:
                'Notifica per sospensione dell’account per problemi di pagamento',
              content:
                'Notifica per sospensione a causa di contenuti inappropriati',
              report: 'Notifica per sospensione dovuta a segnalazioni elevate',
            },
          },
          platform: {
            status: {
              update:
                'Notifiche per aggiornamenti, manutenzioni o nuove funzionalità',
              storage: 'Notifiche sull’utilizzo e i limiti di archiviazione',
              streaming: 'Notifiche per qualità o problemi di streaming',
              access:
                'Notifiche per cambiamenti nei permessi di accesso o restrizioni',
            },
          },
        },
        label: {
          course: {
            inCategory: 'Nuovo Corso in “Categoria” sul Marketplace',
            tagged: 'Il tuo Corso è stato Taggato',
            invitation: {
              status: 'Invito Accettato/Rifiutato',
              toSpace: 'Utente Aggiunto/Invitato a uno Spazio',
            },
          },
        },
      },
      notificationKey: {
        calendars: {
          label: 'Calendari',
          event: {
            updates: {
              label: 'Aggiornamenti Evento',
              created: 'Evento Creato',
              deleted: 'Evento Eliminato',
              modified: 'Evento Modificato',
            },
            reminders: {
              label: 'Promemoria Evento',
              upcoming: 'Evento In Arrivo',
              missed: 'Evento Perso',
              invitations: 'Inviti',
            },
          },
        },
        courses: {
          label: 'Corsi',
          changes: {
            label: 'Aggiornamenti Corso & Iscrizioni',
            new: 'Nuovi Corsi Disponibili',
            updated: 'Aggiornamenti Corso',
            startingSoon: 'Corso In Partenza Presto',
          },
          yours: {
            label: 'I Tuoi Corsi',
            missed: 'Corso Perso',
            inCategory: 'Nuovo Corso in “Categoria” nel Marketplace',
            tagged: 'Il Tuo Corso è stato Taggato',
            suspended: 'Corso Sospeso',
          },
        },
        payments: {
          label: 'Pagamenti',
          reports: {
            label: 'Report',
            monthly: 'Report Mensile',
            weekly: 'Report Settimanale',
          },
          transactions: {
            label: 'Transazioni',
            received: 'Pagamento Ricevuto',
            sent: 'Pagamento Inviato',
            successful: 'Pagamento Riuscito',
            installment: 'Rata Pagata',
          },
          course: {
            payment: 'Pagamenti Corso',
            purchased: 'Corso Acquistato',
          },
          subscription: {
            feePaid: 'Quota di Iscrizione Pagata',
            renewal: 'Rinnovo Iscrizione',
          },
          issues: {
            label: 'Problemi & Aggiornamenti Pagamento',
            failed: 'Pagamento Fallito',
            refund: 'Rimborso Eseguito',
            upcoming: 'Pagamento In Arrivo',
          },
          offers: {
            label: 'Promozioni & Offerte',
            special: 'Offerte Speciali',
          },
        },
        qas: {
          label: 'D&R',
          general: 'Attività Generale D&R',
          answer: {
            label: 'Le Tue Domande',
            yours: 'Risposta Alla Tua Domanda',
            new: 'Nuova Risposta',
            markedAsBest: 'La Tua Risposta è stata Segnata Come Migliore',
            teacher: 'Il Docente Ha Risposto Alla Tua Domanda',
            all: 'Tutte Le Tue Domande Sono State Risposte',
          },
          question: {
            label: 'Domande In Corso & Categorie',
            course: 'Nuova Domanda In Corso',
            category: 'Nuova Domanda In Categoria',
            solved: 'Domanda Segnata Come Risolta',
          },
        },
        reviews: {
          label: 'Recensioni',
          new: 'Nuova Recensione',
          updated: 'Recensione Aggiornata',
          comment: 'Commento Alla Recensione',
          teacherResponded: 'Il Docente Ha Risposto Alla Recensione',
        },
        socials: {
          label: 'Social',
          connections: {
            label: 'Connessioni',
            followers: 'Nuovi Follower',
            contact: 'Nuovo Contatto',
          },
          interactions: {
            label: 'Interazioni',
            reactions: 'Commenti & Reazioni',
            reposts: 'Condivisioni',
            mentions: 'Menzioni Nei Post',
          },
          profile: {
            label: 'Profilo',
            visited: 'Utente Ha Visitato Il Profilo',
            updates: 'Aggiornamenti Dalle Persone Che Segui',
          },
        },
        spaces: {
          label: 'Spazi',
          invitations: {
            label: 'Inviti & Membri',
            sent: 'Invito Inviato Allo Spazio',
            status: 'Invito Accettato/Rifiutato',
            added: 'Utente Aggiunto/Invitato nello Spazio',
            removed: 'Utente Rimosso dallo Spazio',
          },
          roles: {
            label: 'Gestione Ruoli',
            changed: 'Ruolo Cambiato',
            assigned: 'Ruolo Utente Assegnato o Cambiato',
          },
          management: {
            label: 'Gestione Spazio',
            deleted: 'Spazio Eliminato',
            edited: 'Spazio Modificato',
            storage: 'Spazio di Memoria Basso',
          },
        },
        systems: {
          label: 'Sistemi',
          account: {
            label: 'Account & Profilo',
            ban: 'Bannato',
            becomeTeacher: 'Diventa un Insegnante',
            completed: 'Profilo Completato',
            incomplete: 'Profilo Incompleto',
            suspend: {
              payment: 'Account Sospeso per Problemi di Pagamento',
              content: 'Account Sospeso per Contenuti Inappropriati',
              report: 'Account Sospeso per Numerosi Report',
            },
          },
          platform: {
            label: 'Aggiornamenti & Stato Piattaforma',
            updates: 'Aggiornamenti del Sistema',
            storage: 'Stato Memoria',
            streaming: 'Stato Streaming',
            access: 'Accesso',
          },
        },
      },
    },
  },
};
