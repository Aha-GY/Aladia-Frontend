export default {
  auth: {
    button: {
      back: 'Torna al Login',
      enter: 'Entra',
      forgot: 'Hai dimenticato la password?',
      sendEmail: 'Invia Email di Recupero',
      login: 'Accedi',
      signup: 'Registrati',
    },
    hint: {
      email: 'Inserisci la tua email di recupero',
      name: 'Nome',
      surname: 'Cognome',
      confirmPassword: 'Conferma la tua password',
      password: 'Inserisci la tua password',
    },
    privacy_policy: 'Politica sulla Privacy',
    terms_conditions: 'Termini e Condizioni',
    accept: 'Accetto i',
    and: 'e',
    or: 'o',
    login: {
      header: {
        welcome: 'Benvenuto su Aladia!',
        description1: 'Crea o accedi al tuo',
        description2: 'account qui sotto',
      },
      body: {
        title: {
          email: 'Inserisci il tuo indirizzo email',
          password: 'Inserisci la tua password',
        },
      },
      socials: {
        google: 'Continua con Google',
        facebook: 'Continua con Facebook',
        apple: 'Continua con Apple',
        terms: 'Termini & Condizioni',
      },
    },
    forgot: {
      header: {
        title: 'Invia la mail di recupero',
        description:
          "Invieremo un'email di recupero all'indirizzo fornito. Assicurati che sia corretto prima di procedere",
      },
      confirm: 'Conferma',
      recovery: {
        title: 'Recupero Password - Aladia',
        description1: 'Recupera la tua password',
        description2: 'usando la tua email',
        description3: 'registrata',
        sent: {
          title: 'Link di Recupero Inviato',
          description1: 'Controlla la tua posta per reimpostare',
          description2: 'la password',
        },
        password: {
          new: 'Inserisci una Nuova Password',
          create: 'Crea Password',
          added: 'Password aggiunta con successo!',
          changed: 'Password modificata con successo!',
          success: 'Continua su Aladia',
        },
      },
    },
    signup: {
      year: 'Su Aladia dal {year}',
      header: {
        title: 'Piacere di Conoscerti!',
        description1: 'Carica una foto profilo',
        description2: 'e completa il tuo',
        description3: 'profilo',
      },
      image: {
        upload: '',
        error: 'Carica il file in formato immagine',
      },
      thanks: 'Grazie per esserti registrato!',
      otp: {
        welcome: 'Bentornato!',
        description:
          'Inserisci qui sotto il codice a 6 cifre inviato al tuo indirizzo email registrato:',
        button: {
          resend: 'Reinvia Email',
          send: 'Invia',
        },
        empty: 'Inserisci il codice di verifica email',
        ask: 'Non hai ricevuto l’email?',
        sent: 'Inviato con successo',
      },
      body: {
        title: 'Completa i tuoi Dati',
      },
      button: {
        marketplace: 'Accedi al Marketplace',
      },
    },
    error: {
      unauthorized: 'Per favore, accedi di nuovo',
      stripe: 'Si è verificato un errore',
      required: 'Questo campo è obbligatorio',
      email: {
        invalid: 'Indirizzo email non valido',
      },
      password: {
        notMatch: 'Le password non coincidono',
        invalid: 'Password non valida',
        required: {
          char7: 'Deve essere diverso dalla password precedente',
          char8: 'Deve contenere almeno 8 caratteri',
          uppercase: 'Deve iniziare con una lettera maiuscola',
          lowercase: 'Deve contenere una lettera minuscola',
          number: 'Deve contenere un numero',
          special: 'Deve contenere un carattere speciale',
          symbol: 'Simbolo non valido',
        },
        strong: 'La tua password è forte',
      },
      name: {
        required: 'Deve contenere almeno 2 caratteri',
      },
    },
    provider: {
      header: {
        title: 'Crea una Password',
        description: 'Il tuo account è attualmente collegato a',
        signIn: 'Accedi utilizzando queste credenziali',
      },
      sent: {
        email: 'Email Inviata!',
        link: 'Invia Link',
      },
    },
  },
};
